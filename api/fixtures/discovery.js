export default {
  issuer: 'https://oidc.gov.bc.ca/auth/realms/devhub',
  authorization_endpoint: 'https://oidc.gov.bc.ca/auth/realms/devhub/protocol/openid-connect/auth',
  token_endpoint: 'https://oidc.gov.bc.ca/auth/realms/devhub/protocol/openid-connect/token',
  token_introspection_endpoint: 'https://oidc.gov.bc.ca/auth/realms/devhub/protocol/openid-connect/token/introspect',
  userinfo_endpoint: 'https://oidc.gov.bc.ca/auth/realms/devhub/protocol/openid-connect/userinfo',
  end_session_endpoint: 'https://oidc.gov.bc.ca/auth/realms/devhub/protocol/openid-connect/logout',
  jwks_uri: 'https://oidc.gov.bc.ca/auth/realms/devhub/protocol/openid-connect/certs',
  check_session_iframe: 'https://oidc.gov.bc.ca/auth/realms/devhub/protocol/openid-connect/login-status-iframe.html',
  grant_types_supported: [
    'authorization_code',
    'implicit',
    'refresh_token',
    'password',
    'client_credentials'
  ],
  response_types_supported: [
    'code',
    'none',
    'id_token',
    'token',
    'id_token token',
    'code id_token',
    'code token',
    'code id_token token'
  ],
  subject_types_supported: [ 'public', 'pairwise' ],
  id_token_signing_alg_values_supported: [
    'PS384', 'ES384',
    'RS384', 'HS256',
    'HS512', 'ES256',
    'RS256', 'HS384',
    'ES512', 'PS256',
    'PS512', 'RS512'
  ],
  id_token_encryption_alg_values_supported: [ 'RSA-OAEP', 'RSA1_5' ],
  id_token_encryption_enc_values_supported: [ 'A128GCM', 'A128CBC-HS256' ],
  userinfo_signing_alg_values_supported: [
    
    'none'
  ],
  request_object_signing_alg_values_supported: [
    
    'none'
  ],
  response_modes_supported: [ 'query', 'fragment', 'form_post' ],
  registration_endpoint: 'https://oidc.gov.bc.ca/auth/realms/devhub/clients-registrations/openid-connect',
  token_endpoint_auth_methods_supported: [

  ],
  token_endpoint_auth_signing_alg_values_supported: [
    'PS384', 'ES384',
 
  ],
  claims_supported: [
    'aud',
    'sub',
    'iss',
    'auth_time',
    'acr'
  ],
  claim_types_supported: [ 'normal' ],
  claims_parameter_supported: false,
  scopes_supported: [
    'openid',
    'profile',
    'email',
    'address',
    'phone',
    'offline_access',
    'roles',
    'web-origins',
    'microprofile-jwt'
  ],
  request_parameter_supported: true,
  request_uri_parameter_supported: true,
  code_challenge_methods_supported: [ 'plain', 'S256' ],
  tls_client_certificate_bound_access_tokens: true,
  introspection_endpoint: 'https://oidc.gov.bc.ca/auth/realms/devhub/protocol/openid-connect/token/introspect'
}