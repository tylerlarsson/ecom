/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes.json';

export default function HomePage() {
  return (
    <div style={{textAlign: 'center'}}>
      <h1>Ecom Freedom Homepage</h1>
      <Link to={routes.LOGIN} style={{textDecoration: 'none'}}>
        <Button variant="contained" color="primary">
          Login
        </Button>
      </Link>
    </div>
  );
}
