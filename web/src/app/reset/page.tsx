"use client";
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import {Suspense} from "react";

const ResetPassword: React.FC = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setConfirmPassword] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (password !== passwordConfirmation) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    try {
      const response = await axios.patch(`http://localhost:3000/auth/reset-password/${token}`, { password, passwordConfirmation });
      setSuccessMessage('Senha redefinida com sucesso.');
    } catch (error) {
      setErrorMessage('Erro ao redefinir senha. Por favor, tente novamente.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Redefinir Senha
        </Typography>
        <form onSubmit={handleResetPassword} style={{ width: '100%' }}>
          <TextField
            label="Nova Senha"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirmar Nova Senha"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={passwordConfirmation}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {successMessage && (
            <Typography color="primary" variant="body2">
              {successMessage}
            </Typography>
          )}
          {errorMessage && (
            <Typography color="error" variant="body2">
              {errorMessage}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '1rem' }}
          >
            Redefinir Senha
          </Button>
        </form>
      </Box>
    </Container>
  );
};

const Page = () => {
  return (
      <Suspense>
          <ResetPassword />
      </Suspense>
  )
}

export default Page;
