const roomsListTemplate = document.querySelector('#roomList-template').innerHTML

fetch('/getRooms').then((response)=>{
    response.json()
    .then((data)=>{
        console.log(data.rooms);
        if (data && data.rooms.length) {
            const html = Mustache.render(roomsListTemplate, data)
            document.querySelector('#form1').insertAdjacentHTML('beforeend', html)

        }
    });
}).catch(e=>console.log(e))

document.querySelector('#form1').addEventListener('submit', (e)=>{
    e.preventDefault()
    const $roomText = document.querySelector('#roomText').value
    const $username = document.querySelector('#username').value
    const $activeRooms = document.querySelector('#activeRooms')
    const roomSelection = $activeRooms.options[$activeRooms.selectedIndex].value
    console.log(roomSelection);
    if($roomText == '' && roomSelection != '') {
        console.log(roomSelection);
        location.href = '/chat.html?room='+roomSelection+'&username='+$username
    } else if($roomText != '') {
        location.href = '/chat.html?room='+$roomText+'&username='+$username
    }
})