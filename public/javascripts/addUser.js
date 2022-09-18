
const userList = document.getElementById('userList');
const searchBar = document.getElementById('searchBar');
const User = document.getElementById("users")
let users = [];

searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();
    const filteredUsers = users.filter((user) => {
        return (
            user.username.toLowerCase().includes(searchString) ||
            user.email.toLowerCase().includes(searchString)
        );
    });
    displayUser(filteredUsers);
    addMember(filteredUsers);
});

const loadUser = async () => {
    try {
        const res = await fetch('http://localhost:8000/userlist');
        users = await res.json();
        displayUser(users);
        addMember(users);
        console.log(users);
    } catch (err) {
        console.error(err);
    }
};

const displayUser = (users) => {
    const htmlString = users
        .map((user) => {
            return `
            <li class="user">
                <p><strong>Username:</strong>${user.username}</p>
                <p>Email: ${user.email}</p>
                <button type="button" id = "${user.username}" class="btn btn-primary">ADD</button>
            </li>
        `;
        })
        .join('');
    userList.innerHTML = htmlString;
};

const addMember = (users) => {
    let val = [];
    for ( const i of users) {
        const userBtn = document.getElementById(i.username);
        let userBtnFlag = false;
        userBtn.addEventListener("click", function () {
            userBtnFlag = !userBtnFlag;
            if (userBtnFlag) {
                let objA =  i._id;
                val.push(objA);
                console.log(val);
                members.value = val;
                userBtn.style = "display: none";
            } else {
                userBtn.style = "display: none";
            }
        });
        
    }
};

loadUser();

