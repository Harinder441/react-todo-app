const express = require("express");
const router = express.Router();
const Todos = require("../../models/todo.model");
const captureDateMiddleware = require("../../middleware/middleware");

router.use(captureDateMiddleware);
/**
 * Get all TODOS:
 * curl http://localhost:8082/v1/todos
 *
 * Get todos with their "startDate" b/w startDateMin and startDateMax
 * curl http://localhost:8082/v1/todos?startDateMin=2020-11-04&startDateMax=2020-12-30
 *
 */
router.get("/", async (req, res) => {
  
  // const data = {};
  if (req.query.startDateMax && req.query.startDateMin) {
    let startDateMax = new Date(req.query.startDateMax);
    startDateMax.setTime(startDateMax.getTime());
    let startDateMin = new Date(req.query.startDateMin);
    startDateMin.setTime(startDateMin.getTime());

    Todos.find(
      {
        startDate: {
          $lte: startDateMax,
          $gte: startDateMin,
        },
      },
      (err, allTodos) => {
        if (err) {
          console.log(err);
        } else {
          res.send(allTodos);
        }
      }
    );

  } else {
    Todos.find({}, (err, allTodos) => {
      if (err) {
        console.log(err);
        res.status(500).send();
      } else {
        res.send(allTodos);
      }

    });

  }


});

/**
 * Add a TODO to the list
 * curl -X POST http://localhost:8082/v1/todos \
    -d '{"name": "Learn Nodejs by doing","startDate": "2021-01-07","endDate": "2021-01-09"}' \
    -H 'Content-Type: application/json'
*/
router.post("/", async (req, res) => {
  let item = req.body;
  // console.log(item);
  // const newTodo = new Todos(item);
  // // Todos.insert(item);
  // newTodo.save();

  Todos.create(item, (err, newlyCreated) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      console.log("New todo item: ", newlyCreated);
      res.status(201).send(newlyCreated);
    }
  });
 
});

/**
 * Update an existing TODO
 * curl -v -X PUT http://localhost:8082/v1/todos \
    -d '{"_id": "<id-value>", "name": "Play tennis","startDate": "2021-01-07","endDate": "2021-01-09"}' \
    -H 'Content-Type: application/json'
 * 
 * Nb: You'll need to change the "id" value to that of one of your todo items
*/
router.put("/", (req, res) => {
   let {_id,name,startDate,endDate} = req.body;
   Todos.updateOne({_id:_id},{name:name,startDate:startDate,endDate:endDate},(err, newlyUpdated) => {
     if (err) {
       console.log(err);
       res.status(500).send();
     } else {
       console.log("Update todo item: ", newlyUpdated);
       res.status(204).send(newlyUpdated);
     }
   });
 
   
});

/**
 * Delete a TODO from the list
 * curl -v -X "DELETE" http://localhost:8082/v1/todos/<id-value>
 *
 * Nb: You'll need to change "<id-value>" to the "id" value of one of your todo items
 */
router.delete("/:id", (req, res) => {
   const IdToDelete = req.params.id;
   console.log('id to delete',IdToDelete)
   Todos.deleteOne({_id:IdToDelete},(err) => {
      if (err) {
        console.log(err);
        res.status(500).send();
      } else {
        console.log("Deleted todo item: ");
        res.status(204).send();
      }
    });
});
Todos.deleteOne({_id:"6559e9ac267b34313258f595"})
module.exports = router;
