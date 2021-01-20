import { Router } from 'express';


const routes = Router();

routes.post('/users', (request, response) => {
  console.log(request.body);

  const { name, email } = request.body;

  const user = {
    name,
    email,
  }
  return response.json(user);
});

export default routes;
