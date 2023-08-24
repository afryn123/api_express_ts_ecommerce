import multer, { FileFilterCallback } from 'multer'
import { Request, Response, NextFunction } from 'express'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const fileStorage = multer.diskStorage({
  destination: (request: Request, file: Express.Multer.File, callback: DestinationCallback): void => {
    callback(null, 'src/assets/images')
  },

  filename: (req: Request, file: Express.Multer.File, callback: FileNameCallback): void => {
    callback(null, `${new Date().getTime()}-${file.originalname}`)
  }
})

const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    callback(null, true)
  } else {
    // req.fileValidationError = 'goes wrong on the mimetype';
    callback(new Error('Image must in (png,jpg,jpeg)'))
  }
}

const maxFileSize = 1 * 1024 * 1024

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
  limits: { fileSize: maxFileSize }
}).single('image')

const handleUploadImage = (req: Request, res: Response, next: NextFunction): any => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(403).json({ success: false, message: err.message })
    } else if (err) {
      res.status(403).json({ success: false, message: err.message })
      return
    }
    // Everything went fine.
    next()
  })
}

export default handleUploadImage
