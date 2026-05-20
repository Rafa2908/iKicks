const regex = {
  name: /^[a-zA-Z\s'-]{2,50}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  phone: /^\+?1?\d{10}$/,
  address:
    /^\d+\s+[a-zA-Z0-9\s.#'-]+\s(?:St|Street|Ave|Avenue|Blvd|Boulevard|Rd|Road|Ln|Lane|Dr|Drive|Ct|Court|Pl|Place|Way|Terrace|Ter|Circle|Cir)\.?$/i,
  sneakerName: /^[a-zA-Z0-9][a-zA-Z0-9\s\-\.\/]*$/,
};

export const nameVerification = (name) => {
  return regex.name.test(name.trim());
};

export const emailVerification = (email) => {
  return regex.email.test(email.trim());
};

export const passwordVerification = (password) => {
  return regex.password.test(password.trim());
};

export const addressVerification = (address) => {
  return regex.address.test(address.trim());
};

export const phoneVerification = (phone) => {
  return regex.phone.test(phone.trim());
};

export const productNameVerification = (name) => {
  return regex.sneakerName.test(name);
};

export const urlValidation = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
