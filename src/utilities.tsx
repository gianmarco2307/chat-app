const regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,10})$/;

export function utilitySetItem (value: any, item?: string){
    if (typeof(value) == 'string') {
        localStorage.setItem('email', JSON.stringify(value));
    } else if (typeof(value) == 'object' && item == 'users') {
        localStorage.setItem('users', JSON.stringify(value));
    } else if (typeof(value) == 'object' && item == 'chat'){
        localStorage.setItem('chat', JSON.stringify(value))
    } else {
        console.error('Item non previsto');
    }
}

export function utilityEmailValidation (value: string){
    if(value.match(regex) != null){
        return true;
    }
    return false;
}