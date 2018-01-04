// @flow

function decodeBase64url(data: string): string {
  return decodeURIComponent(
    atob(data).split('').map(char => (`%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)).join(''),
  );
}

export function decodePayload(token: string): Object {
  let payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  switch (payload.length % 4) {
    case 0:
      break;
    case 1:
      payload += '===';
      break;
    case 2:
      payload += '==';
      break;
    case 3:
      payload += '=';
      break;
    default:
      throw new Error('Invalid the base64url-encoded data.');
  }

  return JSON.parse(decodeBase64url(payload));
}

export default { decodePayload };
