const express = require('express');
const path = require('path');
const UserService = require('./user-service');

const userRouter = express.Router();
const jsonBodyParser = express.json();

userRouter
  .post(
    '/',
    jsonBodyParser,
    async (req, res, next) => {
      let {
        password,
        username,
        name,
        phone,
        description
      } = req.body;

      for (const field of [
        'name',
        'username',
        'password'
      ])
        if (!req.body[field])
          return res.status(400).json({
            error: `Missing '${field}' in request body`
          });

      if (!description) {
        description = '';
      }
      if (!phone) {
        phone = '';
      }
      try {
        const passwordError = UserService.validatePassword(
          password
        );

        if (passwordError)
          return res.status(400).json({
            error: passwordError
          });

        const hasUserWithUserName = await UserService.hasUserWithUserName(
          req.app.get('db'),
          username
        );

        if (hasUserWithUserName)
          return res.status(400).json({
            error: `Username already taken`
          });

        const hashedPassword = await UserService.hashPassword(
          password
        );

        const newUser = {
          username,
          password: hashedPassword,
          name,
          phone,
          description
        };

        const user = await UserService.insertUser(
          req.app.get('db'),
          newUser
        );

        res
          .status(201)
          .location(
            path.posix.join(
              req.originalUrl,
              `/${user.id}`
            )
          )
          .json(
            UserService.serializeUser(
              user
            )
          );
      } catch (error) {
        next(error);
      }
    }
  )
  //returns all users: username, name
  .get('/', (req, res) => {
    UserService.getAllUsers(
      req.app.get('db')
    ).then(result => {
      res.json(result);
    });
  })
  //return one user with id: username, name, description, phone#
  .get('/:id', (req, res) => {
    const { id } = req.params;
    UserService.getUserById(
      req.app.get('db'),
      id
    ).then(result => {
      if (!result) {
        res.status(404).send({
          error: 'user not found'
        });
      }
      res.json(result);
    });
  });
//TODO: make a route that gets users async with contains

module.exports = userRouter;
