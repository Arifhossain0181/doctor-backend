import jwt from 'jsonwebtoken';

// admin authentication middleware

const authadmin = (req, res, next) => {
    try{
        const {atoken} = req.headers;
        if(!atoken){
            return res.json({success:false, message:"Unauthorized admin access"})
        }
        const decoded = jwt.verify(atoken, process.env.JWT_SECRET);

        if(decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.status(401).json({success:false, message:"Unauthorized admin access"})
        }
        console.log('Decoded admin token:', decoded);
        next();

    }
    catch(error){
        console.log(error)
        res.status(401).json({success:false, message:"Unauthorized admin access"})
    }
}

export {authadmin};
export default authadmin;