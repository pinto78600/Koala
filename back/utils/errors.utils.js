module.exports.signUpErrors = err => {
    let errors = { pseudo: '', email: '', password: ''}
    const msg = err.message;
    if(msg.includes('pseudo'))
        errors.pseudo = 'Pseudo incorrect ou déja pris';
    if(msg.includes('email'))
        errors.email = 'Email incorrect';
    if(msg.includes('password'))
        errors.password = 'Le mot de passe doit faire 6 caractètes minimum';
    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes('email'))
        errors.email = 'Cet email est déja enregistré';
    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo'))
        errors.pseudo = 'Ce pseudo est déja pris';

    return errors
}

module.exports.signInErrors = err => {
    let errors = { email: '', password: ''}
    const msg = err.message;
    if(msg.includes('email'))
        errors.email = 'Email inconnu';
    if(msg.includes('password'))
        errors.password = 'Le mot de passe ne correspond pas';

    return errors
}

module.exports.uploadErrors = err => {
    let errors = { format: '', maxSize : '' };
    const msg = err.message;

    if(msg.includes('invalid file'))
        errors.format = "Format incompatible";
    if(msg.includes('max size'))
        errors.maxSize = "Le fichier dépasse 500ko";
    
    return errors
}