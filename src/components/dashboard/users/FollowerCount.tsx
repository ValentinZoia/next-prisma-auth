"use client"
import { FollowerInfo } from '@/types/Post';
import React from 'react'
import { useFollowerUserMutation } from './mutation';

interface FollowerCountProps {
userId: string;
initialState: FollowerInfo;

}



export default function FollowerCount({userId, initialState}: FollowerCountProps) {
  const {data} = useFollowerUserMutation({ userId, initialState });
  
  
    return (
    <span className='text-muted-foreground '>
        
        <span className="font-semibold">{data.followers}</span>
        {" "}Followers
    </span>
  )
}
