import axios from "axios";

const checkUsername = (
  username: string,
  //user_list: { username: string }[],
  usernameRef: React.RefObject<HTMLInputElement | null>
) => {
  // Verificar que el nombre de usuario tenga al menos 3 caracteres
  if (username.length < 3) {
    if (usernameRef.current) {
      usernameRef.current.setCustomValidity(
        "El nombre de usuario debe tener al menos 3 caracteres"
      );
      usernameRef.current.reportValidity();
    }
    return false;
  } 
   if (username.length > 20) {
    if (usernameRef.current) {
      usernameRef.current.setCustomValidity(
        "El nombre de usuario no puede tener más de 20 caracteres"
      );
      usernameRef.current.reportValidity();
    }
    return false;
  }
  if (usernameRef.current) {
    usernameRef.current.setCustomValidity("");
  }
  return true;
};

const checkPassword = (
  password: string,
  confirmPassword: string,
  passwordRef: React.RefObject<HTMLInputElement | null>
) => {
  if (password !== confirmPassword) {
    if (passwordRef.current) {
      passwordRef.current.setCustomValidity("Las contraseñas no coinciden");
      passwordRef.current.reportValidity();
    }
    return false;
  }

  if (password.length < 8) {
    if (passwordRef.current) {
      passwordRef.current.setCustomValidity(
        "La contraseña debe tener al menos 8 caracteres"
      );
      passwordRef.current.reportValidity();
    }
    return false;
  }

  if (passwordRef.current) {
    passwordRef.current.setCustomValidity("");
  }

  return true;
};

const checkEmail = (
  email: string,
  userlist: { email: string }[],
  emailRef: React.RefObject<HTMLInputElement | null>
) => {
  // Verificar que el email no esté registrado
  const emailExists = userlist.some(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
  if (emailExists) {
    if (emailRef.current) {
      emailRef.current.setCustomValidity("El email ya está registrado");
      emailRef.current.reportValidity();
    }
    return false;
  }

  if (emailRef.current) {
    emailRef.current.setCustomValidity("");
  }

  return true;
};

const checkDescription = (
  description: string,
  descriptionRef: React.RefObject<HTMLInputElement | null>
) => {
  // Verificar que la descripcion no tenga mas de 100 caracteres
  if (description.length > 100) {
    if (descriptionRef.current) {
      descriptionRef.current.setCustomValidity(
        "La descripción no puede tener más de 100 caracteres"
      );
      descriptionRef.current.reportValidity();
    }
    return false;
  } 
  if (descriptionRef.current) {
      descriptionRef.current.setCustomValidity("");
    }
  return true;
}

const getUserList = async (apiUrl: string) => {
  try {
    const response = await axios.get(`${apiUrl}/users/`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener la lista de usuarios:", error);
    return [];
  }
};

export { checkUsername, checkPassword, checkEmail, getUserList, checkDescription };
