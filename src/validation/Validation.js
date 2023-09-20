const empty = (value) => {
    const val = value ? value.toString().trim() : value || value === 0;
    return !val;
}

const minimum = (value, min) => {
    return !empty(value) && value.length >= min;
}

const maximum = (value, max) => {
    return !empty(value) && value.length < max;
}

const password = (value) => {
    const pas = /^(?=(.*\d){3})(?=.*[A-Z])(?=.*[a-z])(?=.*[a-z])(?=.*[#!@$^&*_-]).{7-16}$/;
    return !empty(value) && value.length >= 8 ;
}
const email = (value) => {
    const re =
        /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(value).toLowerCase());
};

const aadharValidate = (value) => {
    const reNum = /^[0-9]*$/;
    return !empty(value) && value.length == 12 ;
};


const panNumber = (value) => {
    const reNum = ("[A-Z]{5}[0-9]{4}[A-Z]{1}");
    return !empty(value) && value.length == 10 ;
};

const Va =(values)=>{
    let errors = {}
    if(!values.userName){
        errors.userName="Name Required"
    }
    else if (values.userName.length <2){
        errors.userName="Name must be more than 2 char"
    }
    if(!values.password){
        errors.password="Password Required"
    }
    else if (values.password.length <2){
        errors.password="Password must be more than 2 char"
    }
    return errors;
}

const V =(values)=>{
    let errors = {}
    if(!values.userName ==="ahom" || !values.password ==="123"){
        errors.userName="Either user name is invalid or password is invalid";
    }
    
    if(!values.password){
        errors.password="Password Required"
    }
    else if (values.password.length <2){
        errors.password="Password must be more than 2 char"
    }
    return errors;
}

const Validation = {
    empty,
    minimum,
    maximum,
    email,
    password,
    panNumber,
    aadharValidate,
    Va,
    V,
};

export default Validation;