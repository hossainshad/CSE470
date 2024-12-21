import { PropertyModel } from "../models/Properties.js";
export const dashboard = async (req, res) => {
    const user = req.session.user;
    try {

      let userProperties = [];
      
      if (user.o_flag) {
          userProperties = await PropertyModel.getPropertyByOwner(user.username);
          console.log(userProperties);
      }

      res.render('dashboard', { 
          user: user,
          properties: userProperties
      });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
  };


