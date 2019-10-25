/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';
import Button from '@material-ui/core/Button';

export default function HomePage() {
  return (
    <div>
      <h1>This is the HomePage container!</h1>
      <Button variant="contained" color="primary">
        Button
      </Button>
    </div>
  );
}
