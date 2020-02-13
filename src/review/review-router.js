const express = require('express')
const path = require('path')
const ReviewsService = require('./review-services')
const { requireAuth } = require('../middleware/jwt-auth')

const reviewRouter = express.Router()
const jsonBodyParser = express.json()

reviewRouter// when posting get auth from reviewer
    .route('/')
    //put requireAuth back,
    .post( jsonBodyParser, (req,res,next) => {
        const { comment,  reviewer, reviewee} = req.body
        const newReview = {  comment, reviewer, reviewee }

        for (const [key, value] of Object.entries(newReview))
      if (value == null){
      console.log(newReview)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        
        })
      }

        //newReview.reviewer = req.user.id
        console.log("newReview", newReview)

        ReviewsService.insertReview(
            req.app.get('db'),
            newReview
          )
            .then(review => {
                console.log('REVIEW',review)
              res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${review.id}`))
                .json(ReviewsService.serializeReview(review))
            })
            .catch(next)
          })
        
reviewRouter
  .route('/:review_id')
  .get((req,res,next) => {
    ReviewsService.getById(
      req.app.get('db'),
      req.params.review_id
      )
      .then(review => {
        if(!review){
          res.status(404).send({error: 'review not found'})
        }
        res.json(review)

      })
      .catch(next)
  })
  .delete((req,res,next) => {
    ReviewsService.deleteReview(
      req.app.get('db'),
      req.params.review_id
    )
    .then(numRowsAffected => {
      res.status(204).end()
    })
    .catch(next)
  })
  .patch(jsonBodyParser, (req,res,next) => {
  
    const { comment } = req.body
    const updateReview = { comment }
    //if !comment, then res 400 must have comment must not be null
   ReviewsService.updateReview(
     req.app.get('db'),
     req.params.review_id,
     updateReview
   )
   .then(numRowsAffected => {
     res.status(204).end()
   })
   .catch(next)

  })
   
reviewRouter
//user id retrieves reviewee id
  .route('/user/:user_id')
  .get((req,res,next) => {
    ReviewsService.getReviewsByUserId(
        req.app.get('db'),
        req.params.user_id
    )
    .then(user => {
      if(!user){
        res.status(404).send({error: 'user not found'})
      }
        res.json(user)
    })
    .catch(next)
  })

    


module.exports = reviewRouter