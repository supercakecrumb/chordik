import React from 'react';
import Button from './Button';
import IconButton from './IconButton';
import VoteButton from './VoteButton';

// Simple story-like component to validate our button implementations
const ButtonDemo = () => {
  return (
    <div className="p-8 bg-base-900 text-trans-white space-y-8">
      <h1 className="text-2xl font-bold mb-6">Button Component Demo</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Button Sizes</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button size="default">Default</Button>
          <Button size="compact">Compact</Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Button States</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">IconButton Variants</h2>
        <div className="flex flex-wrap gap-4">
          <IconButton 
            variant="primary" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            }
            aria-label="Add"
          />
          <IconButton 
            variant="secondary" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            }
            aria-label="Add"
          />
          <IconButton 
            variant="ghost" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            }
            aria-label="Add"
          />
          <IconButton 
            variant="danger" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            }
            aria-label="Add"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Vote Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <VoteButton direction="up" />
          <VoteButton direction="down" />
          <VoteButton direction="up" active score={5} />
          <VoteButton direction="down" active score={3} />
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Button Group (Song Detail Style)</h2>
        <div className="flex gap-3">
          <Button variant="primary">Back to Songs</Button>
          <Button variant="secondary">Edit</Button>
          <Button variant="danger">Delete</Button>
        </div>
      </div>
    </div>
  );
};

export default ButtonDemo;