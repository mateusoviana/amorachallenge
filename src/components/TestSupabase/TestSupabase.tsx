import React, { useState } from 'react';
import { Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { supabase } from '../../lib/supabase';

const TestSupabase: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(1);

      if (error) throw error;

      setResult(`Conexão OK! Encontrados ${data?.length || 0} usuários.`);
    } catch (err: any) {
      setError(`Erro na conexão: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testInsert = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          name: 'Teste User',
          email: `teste${Date.now()}@email.com`,
          user_type: 'buyer'
        })
        .select()
        .single();

      if (error) throw error;

      setResult(`Usuário criado com sucesso! ID: ${data.id}`);
    } catch (err: any) {
      setError(`Erro ao criar usuário: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: 2, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Teste de Integração Supabase
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button 
          variant="outlined" 
          onClick={testConnection}
          disabled={loading}
        >
          Testar Conexão
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={testInsert}
          disabled={loading}
        >
          Testar Insert
        </Button>
      </Box>

      {loading && <CircularProgress size={24} />}
      
      {result && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {result}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default TestSupabase;