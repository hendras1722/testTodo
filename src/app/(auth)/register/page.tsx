'use client'

import React, { useState } from 'react'
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  InputAdornment,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApi } from '@/composable/useApi'
import type { RegisterRequest } from '@/type/register'
import { BaseResponse } from '@/type/baseResponse'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1, 'Username required'),
  password: z.string().nonempty(),
})

type LoginFormInputs = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  })

  const { mutate, isPending } = useApi<BaseResponse<null>, RegisterRequest>({
    url: '/api/register',
    method: 'POST',
    onSuccess: () => {
      window.location.href = '/login'
    },
  })
  const onSubmit = async (data: LoginFormInputs) => {
    mutate({
      email: data.email,
      username: data.username,
      password: data.password,
    })
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 10 }}>
      <Typography variant="h5" mb={3} textAlign="center">
        Login
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box mb={2}>
          <TextField
            label="Email"
            fullWidth
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Username"
            fullWidth
            type="text"
            {...register('username')}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
        </Box>

        <Box mb={3}>
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="start">
                    <button onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </InputAdornment>
                ),
              },
            }}
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password')}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isPending}
        >
          {(isPending && 'Loading...') || 'Login'}
        </Button>
      </form>
      <p>
        Apakah kamu sudah punya akun? <Link href={'/login'}>Login</Link>
      </p>
    </Paper>
  )
}
