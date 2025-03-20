'use client'
import { getAllUsers } from '@/utils/supabaseFunction';
import React,{useEffect, useState} from 'react'

const Datatest = () => {
const [users,setUsers] = useState<any[]>([]);

useEffect(() =>{
  const getUsers = async() =>{
    const users = await getAllUsers();
    console.log(users);
  };
  getUsers(); 
},[])
  return (
    <div>Datatest</div>
  )
}

export default Datatest