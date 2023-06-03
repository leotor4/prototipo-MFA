# Protótipo 2FA Unifor

O Protótipo 2FA Unifor é uma aplicação simples que ilustra como implementar um sistema de autenticação de dois fatores (2FA) utilizando One-Time Passwords (OTP) em Node.js e JAVA.

## Visão geral

A Protótipo 2FA Unifor fornece dois endpoints:

- `POST /generate`: Gera um OTP para um usuário específico. Espera um JSON no corpo da requisição com a chave `secret` e retorna um OTP e o tempo de validade do OTP.
- `POST /validate`: Valida um OTP fornecido para um usuário específico. Espera um JSON no corpo da requisição com as chaves `secret` e `otp`.

## Instruções de uso

1. Clone o repositório em sua máquina local.
2. Defina a variável de ambiente `ENCRYPTION_KEY` no arquivo `.env`.
3. Execute a api via Docker 
```cli
docker build -t otp-api .
docker run -p 3000:3000 otp-api
```

Agora você pode enviar solicitações para `http://localhost:3000/otp/generate` e `http://localhost:3000/otp/validate` para gerar e validar OTPs.

### Exemplo de requisição

Para gerar um OTP para o usuário, envie uma requisição POST para `http://localhost:3000/otp/generate` com o seguinte corpo de requisição:

```json
{
    "secret": "chave-encriptada"
}
```
Para validar um OTP, envie uma requisição POST para http://localhost:3000/otp/validate com o seguinte corpo de requisição:
```json
{
	"secret": "e2e47a0b",
	"otp": 982974
}
```