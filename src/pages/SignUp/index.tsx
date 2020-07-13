import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';


import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();


  const handleSubmit = useCallback(async (data: SignUpFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required').email('Type a valid Email'),
        password: Yup.string().min(6, 'Password must be at least 6 characters'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/users', data);

      history.push('/');

      addToast({
        type: 'success',
        title: 'You are registered!',
        description: 'You can login now'
      });


    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)

        formRef.current?.setErrors(errors);

        return;
      }
      addToast({
        type: 'error',
        title: 'Failed to sign up',
        description: 'Something went wrong while registering. try again',
      });
    }
  }, [addToast, history]);

  return (

    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit} >
            <h1>Create your account</h1>

            <Input name="name" icon={FiUser} placeholder="Name" />
            <Input name="email" icon={FiMail} placeholder="Email" />
            <Input name="password" icon={FiLock} type="password" placeholder="Password" />
            <Button type="submit">Create</Button>

          </Form>

          <Link to="/">
            <FiArrowLeft />
        Back to Login
      </Link>
        </AnimationContainer>
      </Content>
    </Container>

  );
};

export default SignUp;
