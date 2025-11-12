import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { useAuthStore } from '@/lib/store'
import Image from 'next/image'
import { User } from 'lucide-react'

const ImageDialog = ({isIamgeDialogOpen, setIsIamgeDialogOpen} : {isIamgeDialogOpen: boolean, setIsIamgeDialogOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {

  const {user} = useAuthStore((state) => state)
  const [image, setImage] = useState<string | null>(null)

  const changeProfilehandler = async () =>{
    if(!image) return;
    console.log(image)
  }

  return (
    <div className='z-50 '>
      <Dialog open={isIamgeDialogOpen} onOpenChange={() => setIsIamgeDialogOpen(false)}>
        <DialogContent className='bg-gray-600 '>
          <DialogHeader>
            <DialogTitle className='text-white text-xl text-center'>Change Profile Picture</DialogTitle>
          </DialogHeader>
          <div className='flex items-center justify-center mt-10'>
             {image ? <Image src={image || '/avatar.svg'} alt='profile' width={200} height={200} className='rounded-full' />
             : <div className='w-50 h-50 rounded-full bg-gray-500 flex items-center justify-center'>
                <User className='w-24 h-24 text-white' />
              </div>
             }
          </div>
          <div className='flex items-center justify-center'>
            <input type='file' className='hidden' id='image' onChange={(e) => setImage(URL.createObjectURL(e.target.files![0]))} />
            <label htmlFor='image' className='cursor-pointer text-white text-lg p-2 border rounded-xl border-white'>Choose Image</label>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsIamgeDialogOpen(false)}>Cancel</Button>
            <Button onClick={changeProfilehandler}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ImageDialog
