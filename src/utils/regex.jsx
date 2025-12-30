export const Regex = {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,

    PHONE_REGEX: /^(0)(3|5|7|8|9)([0-9]{8})$/,

    USERNAME_REGEX: /^[a-zA-Z0-9_-]+$/,

    URL_REGEX: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w .-]*)*\/?$/
};
