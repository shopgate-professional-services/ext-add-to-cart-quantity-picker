import React from 'react';
import PropType from 'prop-types';
import { withPageProductId } from '@shopgate-ps/pwa-extension-kit/connectors';
import AddToCartBar from '../../components/AddToCartBar';

/**
 * PDPAddToCartBar component
 * @param {Node} children Children of portal.
 * @return {Node}
 */
const PDPAddToCartBar = ({ children, ...rest }) => (
  <AddToCartBar {...rest} />
);

PDPAddToCartBar.propTypes = {
  children: PropType.node,
};

PDPAddToCartBar.defaultProps = {
  children: null,
};

export default withPageProductId(PDPAddToCartBar);
