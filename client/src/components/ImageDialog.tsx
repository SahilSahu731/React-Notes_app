import React from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'

const ImageDialog = ({isIamgeDialogOpen, setIsIamgeDialogOpen} : {isIamgeDialogOpen: boolean, setIsIamgeDialogOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  return (
    <div>
      <Dialog open={isIamgeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Profile Picture</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsIamgeDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsIamgeDialogOpen(false)}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ImageDialog
