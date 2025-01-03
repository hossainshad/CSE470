import { PropertyModel } from "../models/Properties.js";
import { FlatModel } from "../models/Flats.js";
export const dashboard = async (req, res) => {
    const user = req.session.user;
    try {

      let userProperties = [];
      
      if (user.o_flag) {
          userProperties = await PropertyModel.getPropertyByOwner(user.username);
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
export const manageProperty = async (req, res) => {
    const user = req.session.user;
    const propertyId = req.params.p_id;

    try {
        const property = await PropertyModel.getPropertyById(propertyId, user.username);
        
        if (!property) {
            return res.status(404).send('Property not found');
        }

        const flats = await FlatModel.getFlatsForProperty(propertyId);

        res.render('propertyManage', {
            user: user,
            property: property,
            flats: flats
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

