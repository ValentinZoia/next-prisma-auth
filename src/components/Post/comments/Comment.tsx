import { CommentData } from '@/types/Post'
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react'
import UserAvatar from '../UserAvatar';
import { compareDate } from '@/utils/compareDate';
import CommentMoreButton from './CommentMoreButton';

interface CommentProps {
    comment: CommentData;
}

export  function Comment(comment: CommentProps) {
    const session = useSession();
    
  
    return (
    <div className='group/comment flex gap-3 py-3'>
      <span className='inline'>
        <Link href={`/${comment.comment.user.name}`}>
          <UserAvatar avatarUrl={comment.comment.user.image} username={comment.comment.user.name as string} imageType='profileSmall'  />
        </Link>
      </span>
      <div>
        <div className='flex items-center gap-1 text-sm'>
          <Link href={`/${comment.comment.user.name}`} className='font-medium hover:underline text-primary'>
            {comment.comment.user.name}
          </Link>
          <span className='text-muted-foreground'>
            {compareDate(new Date(comment.comment.createdAt))}
          </span>
          
        </div>
        <div className='text-sm text-primary'>{comment.comment.content}</div>

      </div>
      {comment.comment.userId === session.data?.user.id && (
        <CommentMoreButton commentId={comment.comment.id} commentContent={comment.comment.content} />
      )}
    </div>
  )
}

Comment.displayName = 'Comment'