// !Global Variables
const addEmployeeBtn = document.querySelector('#addEmployee');
const modalElem = document.querySelector('.custom-modal');
const closeBtn = document.querySelector('.close-icon');
const registrationForm = document.querySelector('#registrationForm');
const userID = document.querySelector('#id');
const userName = document.querySelector('#name');
const userEmail = document.querySelector('#email');
const userAge = document.querySelector('#age');
const userJob = document.querySelector('#job');
const tableBody = document.querySelector('#table-body');
const addPhoto = document.querySelector('#addProfilePic');
const profile_pic = document.querySelector('.profile_pic');
const getFile = document.querySelector('#getFile');
const updateBtn = document.querySelector('#update-btn');
const registerBtn = document.querySelector('#registerBtn');
const allInputs = document.querySelectorAll('input');
const clearAll = document.querySelector('#clearAll');
const dummyImg = 'https://cvbay.com/wp-content/uploads/2017/03/dummy-image.jpg';
let userData = [];
let imgUrl;

// ! Active the modal
addEmployeeBtn.addEventListener('click', () => {
  modalElem.classList.add('active');

  registerBtn.disabled = false;
  updateBtn.disabled = true;
});

// !Close the Modal

closeBtn.addEventListener('click', () => {
  modalElem.classList.remove('active');
  // !Clear all input after updating
  allInputs.forEach((input) => {
    input.value = '';
  });

  profile_pic.src = dummyImg;
});

// !Add Multiple data into localStorage

if (localStorage.getItem('userData') != null) {
  userData = JSON.parse(localStorage.getItem('userData'));
}

const registerData = () => {
  userData.push({
    id: userID.value,
    name: userName.value,
    email: userEmail.value,
    age: userAge.value,
    job: userJob.value,
    profilePic: imgUrl == undefined ? dummyImg : imgUrl,
  });
  const userString = JSON.stringify(userData);
  localStorage.setItem('userData', userString);
};

// !Register button to send data into localStorage

registerBtn.addEventListener('click', (e) => {
  // !Prevent to reload the form

  if (
    userName.value == '' ||
    userID.value == '' ||
    userAge.value == '' ||
    userEmail.value == '' ||
    userJob.value == ''
  ) {
    swal(
      'Oops..! 🤔',
      'Please Fill the Form. You are missing something!',
      'error'
    );
  } else {
    e.preventDefault();
    registerData();
    registrationForm.reset();
    closeBtn.click();
    getLocalData();
    swal({
      title: 'Success! ',
      text: 'Your data is added into table!',
      icon: 'success',
    });
  }
});

// !Add a Photo in the form

addPhoto.addEventListener('click', () => {
  getFile.click();
});

// !Show image in the modal
getFile.addEventListener('change', () => {
  if (getFile.files[0].size < 100000) {
    const fReader = new FileReader();
    fReader.addEventListener('load', (e) => {
      imgUrl = e.target.result;
      profile_pic.src = imgUrl;
    });
    fReader.readAsDataURL(getFile.files[0]);
  } else {
    swal({
      title: 'Oops',
      text: 'File size is too large!',
      icon: 'error',
    });
  }
});

// !Return the data from localStorage to page

const getLocalData = () => {
  tableBody.innerHTML = '';
  userData.forEach((data, index) => {
    const { profilePic, id, name, email, age, job } = data;
    tableBody.innerHTML += `
              <tr>
                <th scope="row">${index + 1}</th>
                <td>
                  <img
                    src="${profilePic}"
                    alt="img"
                    width="30"
                    id="image" />
                </td>
                <td>${id}</td>
                <td>${name}</td>
                <td>${email}</td>
                <td>${age}</td>
                <td>${job}</td>
                <td class="btn-group">
                  <button class="btn btn-success" id= "edit-btn">
                    <i class="bi bi-pencil-fill"></i>
                  </button>
                  <button class="btn btn-danger" id= "delete-btn">
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </td>
              </tr>
    `;

    // !Edit the Single Item
    const editButtons = document.querySelectorAll('#edit-btn');
    editButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        const editTr = btn.parentElement.parentElement;
        const editTd = editTr.getElementsByTagName('td');
        const imgTag = editTd[0].getElementsByTagName('img');
        const display_pic = imgTag[0].src;

        const id = editTd[1].innerHTML;
        const name = editTd[2].innerHTML;
        const email = editTd[3].innerHTML;
        const age = editTd[4].innerHTML;
        const job = editTd[5].innerHTML;

        userID.value = id;
        userName.value = name;
        userAge.value = age;
        userEmail.value = email;
        userJob.value = job;
        profile_pic.src = display_pic;

        addEmployeeBtn.click();
        registerBtn.disabled = true;
        updateBtn.disabled = false;

        // !Update btn setting
        updateBtn.addEventListener('click', (e) => {
          e.preventDefault();
          userData[index] = {
            id: userID.value,
            name: userName.value,
            age: userAge.value,
            job: userJob.value,
            email: userEmail.value,

            profilePic: getFile.value == '' ? display_pic : imgUrl,
          };
          localStorage.setItem('userData', JSON.stringify(userData));
          closeBtn.click();
          getLocalData();
        });
      });
    });
  });

  // !Delete single item
  const deleteButtons = document.querySelectorAll('#delete-btn');
  deleteButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      // !Sweet Alert are you sure to delete
      swal({
        title: 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this imaginary file!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          // !Get the Current TR form table
          const tr = btn.parentElement.parentElement;
          tr.remove();
          userData.splice(index, 1);
          getLocalData();
          localStorage.setItem('userData', JSON.stringify(userData));
          swal('Poof! Your imaginary file has been deleted!', {
            icon: 'success',
          });
        } else {
          swal('Your imaginary file is safe!');
        }
      });
    });
  });
};

getLocalData();

// !Search Function start from here
const searchBar = document.querySelector('#searchBar');
searchBar.addEventListener('input', (e) => {
  const inputValue = e.target.value.toLowerCase();
  const tableIDs = document.querySelectorAll('tr');

  tableIDs.forEach((id) => {
    if (id.textContent.toLowerCase().includes(inputValue)) {
      id.style.display = '';
    } else {
      id.style.display = 'none';
    }
  });
});

// !When user want clear all data
clearAll.addEventListener('click', () => {
  swal({
    title: 'Are you sure?',
    text: 'Once deleted, you will not be able to recover this imaginary file!',
    icon: 'warning',
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      localStorage.removeItem('userData');
      window.location = location.href;
      swal('Poof!   Your data has been deleted successfully!', {
        icon: 'success',
      });
    } else {
      swal({
        title: 'Do not worry! ',
        text: 'Your data is safe now!',
        icon: 'success',
      });
    }
  });
});
