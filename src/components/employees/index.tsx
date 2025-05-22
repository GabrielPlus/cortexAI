import React from 'react'
import { Button } from '../ui/button'
import { Heading } from '../ui/heading'
import { Plus } from 'lucide-react'
import EmployeeBar from '../employeebar'

function AddNewEployee() {
  return (
    <><EmployeeBar />
    <div className="flex items-center justify-between">
        <Heading
        title="Employees (0)"
        description="Manage employees for this platform"
        />
      <Button>
        <Plus className="mr-2 h-4 w-4"/>
        Add New</Button>
        
    </div>
    </>
  )
}

export default AddNewEployee
