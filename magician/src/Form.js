import React, {useState, useEffect} from 'react';
import axios from 'axios';
import * as yup from 'yup';


const formSchema = yup.object().shape({
    name: yup.string().required("Wizard must have name."),
    email: yup
      .string()
      .email("Must be a valid human email address.")
      .required("Must include human email address."),
      password: yup.string()
      .required('Need a password Wizard'), 
    terms: yup.boolean().oneOf([true], "please agree to terms of use"),
   
  });
  
  export default function Form() {
    
    const [buttonDisabled, setButtonDisabled] = useState(true);
  
    
    const [formState, setFormState] = useState({
      name: "",
      email: "",
      password: "",
      terms: "",
     
    });
  
    const [errors, setErrors] = useState({
      name: "",
      email: "",
      password: "",
      terms: "",
     
    });
  
   
    const [post, setPost] = useState([]);
  
    useEffect(() => {
      formSchema.isValid(formState).then(valid => {
        setButtonDisabled(!valid);
      });
    }, [formState]);
  
    const formSubmit = e => {
      e.preventDefault();
      axios
        .post("https://reqres.in/api/users", formState)
        .then(res => {
          setPost(res.data); 
          console.log("success", post);
          setFormState({
            name: "",
            email: "",
            password: "",
            terms: "",
           
          });
        })
        .catch(err => console.log(err.response));
    };
  
    const validateChange = e => {
     
      yup
        .reach(formSchema, e.target.name)
        .validate(e.target.value)
        .then(valid => {
          setErrors({
            ...errors,
            [e.target.name]: ""
          });
        })
        .catch(err => {
          setErrors({
            ...errors,
            [e.target.name]: err.errors[0]
          });
        });
    };
  
    const inputChange = e => {
      e.persist();
      const newFormData = {
        ...formState,
        [e.target.name]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value
      };
  
      validateChange(e);
      setFormState(newFormData);
    };
  
    return (
      <form onSubmit={formSubmit}>
        <label htmlFor="name">
          Name
          <input
            type="text"
            name="name"
            placeholder='Name'
            value={formState.name}
            onChange={inputChange}
          />
          {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
        </label><br/>
        <label htmlFor="email">
          Email
          <input
            type="text"
            name="email"
            placeholder='Email'
            value={formState.email}
            onChange={inputChange}
          />
          {errors.email.length > 0 ? (
            <p className="error">{errors.email}</p>
          ) : null}
        </label><br/>
        <label htmlFor="password">
         Password
          <input
            type='password'
            name="password"
            placeholder='Password'
            value={formState.motivation}
            onChange={inputChange}
          />
          {errors.password.length > 0 ? (
            <p className="error">{errors.password}</p>
          ) : null}
        </label><br/>
        <label htmlFor="terms" className="terms">
          <input
            type="checkbox"
            name="terms"
            checked={formState.terms}
            onChange={inputChange}
          />
          Terms & Conditions
        </label><br/>
        
        
        
        <button disabled={buttonDisabled}>Become a</button>

        <pre>{JSON.stringify(post, null, 3)}</pre>
      </form>
    );
  }