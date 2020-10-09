const socket = io()
// socket.on('countUpdated', (count)=>{
//     console.log('The count has been updated', count);
// })

// document.querySelector('#increment').addEventListener('click', ()=>{
//     console.log('Clicked');
//     socket.emit('increment')
// })


// Elements -- use $ to distingish selected DOM elements - just for ease of use
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const {room,username} = Qs.parse(location.search, {ignoreQueryPrefix: true})
const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageheight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight
    // 


    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageheight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('msg', (msg)=>{
    console.log(msg);
    const html = Mustache.render(messageTemplate, {
        username: msg.username,
        message: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})
$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error) return console.log(error);
        console.log('Message was delivered');
    })
})

$sendLocationButton.addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition(position=>{
        socket.emit('sendLocation', {latitude: position.coords.latitude, longitude:position.coords.longitude},
         ()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!');
        })
    })
})

socket.on('locationMessage', (location)=>{
    const html = Mustache.render(locationTemplate, {
        username: location.username,
        locationURL: location.url,
        createdAt: moment(location.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.emit('join', {username, room}, (error)=>{
    if(error) {
        alert(error)
        location.href = '/'
    }
})

socket.on('roomData', ({room, users})=>{
    const html = Mustache.render(sidebarTemplate, {room,users})
    document.querySelector('#sidebar').innerHTML = html
})