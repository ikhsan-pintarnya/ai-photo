export function getClientId(): string {
  let id = localStorage.getItem('pintarnya_client_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('pintarnya_client_id', id);
  }
  return id;
}
