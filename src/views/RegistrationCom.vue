<template>
    <div class="container">
        <h1>Registration Page</h1>
        <div class="formcontrol">
            <form @submit.prevent="ChekingThevalidation">
                <div>
                    <label for="first-name">First Name
                        <FontAwesomeIcon class="icionw" :icon="fa_Asterisk" />
                    </label>
                    <input id="first-name" v-model.trim="fname" type="text" @input="Vfname">
                    <span v-if="firstNameError">{{ firstNameError }}</span>
                </div>
                <div>
                    <label for="last-name">Last Name
                        <FontAwesomeIcon class="icionw" :icon="fa_Asterisk" />
                    </label>
                    <input id="last-name" v-model.trim="lname" type="text" @input="Vlname">
                    <span v-if="lirstNameError">{{ lirstNameError }}</span>
                </div>
                <div>
                    <label for="email">Email
                        <FontAwesomeIcon class="icionw" :icon="fa_Asterisk" />
                    </label>
                    <input id="email" v-model.trim="email" type="email" @input="validateEmail">
                    <span v-if="emailError">{{ emailError }}</span>
                </div>
                <div>
                    <label for="password">Password
                        <FontAwesomeIcon class="icionw" :icon="fa_Asterisk" />
                    </label>
                    <input id="password" v-model.trim="password" @input="validatePassword" type="password">
                    <span v-if="passwordError">{{ passwordError }}</span>
                </div>
                <div>
                    <label for="phone">Phone No
                        <FontAwesomeIcon class="icionw" :icon="fa_Asterisk" />
                    </label>
                    <input id="phone" v-model.trim="phone" type="tel" @input="validMobile">
                    <span v-if="phoneError">{{ phoneError }}</span>
                </div>


                <div>
                    <label>Gender
                        <FontAwesomeIcon class="icionw" :icon="fa_Asterisk" />
                    </label>
                    <label for="male">Male</label>
                    <input id="male" v-model="gender" type="radio" value="male">
                    <label for="female">Female</label>
                    <input id="female" v-model="gender" type="radio" value="female">
                </div>
                <div>
                    <label for="hobby">Hobby Selection</label>
                    <div>
                        <input type="checkbox" id="jack" value="Jack" v-model="Hobby" @change="HobbyCheck()">
                        <label for="jack">Jack</label>
                    </div>
                    <div>
                        <input type="checkbox" id="john" value="John" v-model="Hobby" @change="HobbyCheck()">
                        <label for="john">John</label>
                    </div>
                    <div>
                        <input type="checkbox" id="mike" value="Mike" v-model="Hobby" @change="HobbyCheck()">
                        <label for="mike">Mike</label>
                    </div>
                    <span v-if="hobbyError">{{ hobbyError }}</span>
                </div>

                <div>
                    <label>Address</label>
                    <input id="Add" v-model="Address" type="text">
                </div>
                <div>
                    <label>Role
                        <FontAwesomeIcon class="icionw" :icon="fa_Asterisk" />
                    </label>
                    <label for="male">User</label>
                    <input id="male" v-model="Role" type="radio" value="User">
                    <label for="female">Admin</label>
                    <input id="female" v-model="Role" type="radio" value="Admin">
                </div>

                <div>
                    <button type="submit">Submit</button>
                    <RouterLink to="/" v-if="!isAuthenticated" class="nav-link">Login</RouterLink>


                </div>
            </form>
        </div>
    </div>
    <div>
    </div>
</template>
<script setup>
import { useAuthStore } from '../stores/auth';
import { ref, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'vue-router';
import { RouterLink } from 'vue-router'



const fa_Asterisk = faAsterisk;
import axios from 'axios';

const FormData = useAuthStore();
const router = useRouter();

const fname = ref('');
const lname = ref('');
const email = ref('');
const password = ref('');
const phone = ref(0);
const gender = ref('male');
const Address = ref('');
const id = ref('');
const task = ref([]);
const Hobby = ref([]);
const hobbyError = ref('');

const passwordError = ref('');
const firstNameError = ref('');
const lirstNameError = ref('');
const emailError = ref('');
const phoneError = ref('');
const checkError = ref('');
const Role=ref('User')
const isFormEmpty = computed(() => {
    return !fname.value || !lname.value || !email.value || !phone.value || !gender.value || !Hobby.value;
});

const hasErrors = computed(() => {
    return !!firstNameError.value || !!lirstNameError.value || !!emailError.value || !!phoneError.value || !!checkError.value || isFormEmpty.value || passwordError.value || hobbyError.value;
});

const validatePassword = () => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?!.*\s).{8,}$/;
    if (!regex.test(password.value)) {
        passwordError.value = 'Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, and one digit.';
    } else {
        passwordError.value = '';
    }
};

const Vfname = () => {
    const regex = /^[a-zA-Z]*$/;
    if (!regex.test(fname.value)) {
        firstNameError.value = 'Only alpha are allowed in the fname.';
        fname.value = fname.value.replace(/[^a-zA-Z]/g, '');
    } else if (!fname.value) {
        firstNameError.value = 'FName is Required';
    } else if (fname.value.length < 3) {
        firstNameError.value = 'Please Enter Min 3 Char';
    } else {
        firstNameError.value = '';
    }
};

const Vlname = () => {
    const regex = /^[a-zA-Z]*$/;
    if (!regex.test(lname.value)) {
        lirstNameError.value = 'Only alpha are allowed in the fname.';
        lname.value = lname.value.replace(/[^a-zA-Z]/g, '');
    } else if (!lname.value) {
        lirstNameError.value = 'LName is Required';
    } else if (lname.value.length < 3) {
        lirstNameError.value = 'Please Enter Min 3 Char';
    } else {
        lirstNameError.value = '';
    }
};

const validateEmail = async () => {
    try {
        const response = await axios.get('http://localhost:3000/register/');
        const userData = response.data;
        var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const emailExists = userData.some(user => user.email === email.value);
        if (!email.value) {
            emailError.value = 'Field is Required.';
        } else if (!regex.test(email.value)) {
            emailError.value = 'Please enter a valid email address.';
        } else if (emailExists) {
            emailError.value = 'Email Already Exist';
        } else {
            emailError.value = '';
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

const validMobile = () => {
    const regex = /^\d{10}$/;
    if (!phone.value) {
        phoneError.value = 'Field is Required.';
    } else if (!regex.test(phone.value)) {
        phoneError.value = 'Entered number is not valid';
    } else {
        phoneError.value = '';
    }
};
const HobbyCheck = () => {
    if (Hobby.value.length === 0) {
        hobbyError.value = "Please select at least one hobby";
    } else {
        hobbyError.value = "";
    }
};

const ChekingThevalidation = () => {
    Vfname();
    Vlname();
    validateEmail();
    validatePassword();
    validMobile();
    HobbyCheck();
    if (!hasErrors.value && !isFormEmpty.value) {
        submitForm();
    }
};

const submitForm = () => {
    const formdata = {
        fname: fname.value,
        lname: lname.value,
        Fullname: fname.value + ' ' + lname.value,
        email: email.value,
        password: password.value,
        phone: phone.value,
        gender: gender.value,
        Hobby: Hobby.value,
        Address: Address.value,
        task: task.value,
        Role: Role.value
    };

    console.log('Form submitted:', formdata);
    FormData.register(formdata);
    alert('Form submitted successfully');
    fname.value = '';
    lname.value = '';
    email.value = '';
    phone.value = '';
    gender.value = 'male';
    Hobby.value = [];
    Address.value = '';
    router.push({ path: '/' });
};
</script>

<style scoped>
.container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
}

.formcontrol {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 5px;
}

.icionw {
    color: red;
    font-size: xx-small;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="tel"],
input[type="radio"],
input[type="checkbox"] {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
}

button[type="submit"] {
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button[type="submit"]:hover {
    background-color: #45a049;
}

.error {
    color: red;
}


@media (max-width: 768px) {
    .container {
        max-width: 100%;
    }
}

span {
    color: red;
}
</style>
