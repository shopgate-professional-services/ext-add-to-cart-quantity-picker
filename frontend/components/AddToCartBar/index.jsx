import React, { useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { Input } from '@shopgate/engage/components';
import { Section } from '@shopgate/engage/a11y';
import { useCurrentProduct } from '@shopgate/engage/core';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import AddToCartButton from './components/AddToCartButton';

const { colors, shadows } = themeConfig;

const styles = {
  container: css({
    background: colors.light,
    boxShadow: shadows.cart.paymentBar,
    position: 'relative',
    zIndex: 2,
    overflow: 'hidden',
    padding: '8px',
    display: 'flex',
  }),
  innerContainer: css({
    minHeight: 46,
    display: 'flex',
    flex: 1,
  }),
  inputContainer: css({
    border: '1px solid #DCDCDC',
    borderRadius: 5,
    borderLeft: 0,
    borderRight:0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    padding: '0px 20px 0px 20px',
    display: 'flex',
    minWidth: 48,
  }),
  input: css({
    outline: 'none',
    textAlign: 'center',
    fontWeight: 700,
    width: '2em',
    padding: 0,
    '::-webkit-outer-spin-button': {
      appearance: 'none',
      margin: 0,
    },
    '::-webkit-inner-spin-button': {
      appearance: 'none',
      margin: 0,
    },
  }).toString(),
  button: css({
    fontSize: 16,
    fontWeight: 700,
    padding: '11px 9.6px 13px',
    flex: 1,
    marginLeft: 4,
  }).toString(),
  cartInputButtonPlus: css({
    border: '1px solid #DCDCDC',
    borderRadius: 5,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    padding: '0px 18px 4px 18px',
    fontSize: '1.25rem',
    fontWeight: 500,
  }).toString(),
  cartInputButtonMinus: css({
    border: '1px solid #DCDCDC',
    borderRadius: 5,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    padding: '0px 18px 4px 18px',
    fontSize: '1.25rem',
    fontWeight: 500,
  }).toString(),
};

/**
 * AddToCartBar component
 * @param {Object} props Component props
 * @returns {JSX}
 */
const AddToCartBar = ({
  handleAddToCart, resetClicked, loading, disabled, conditioner,
}) => {
  const { setQuantity: setContextQuantity, productId } = useCurrentProduct();
  const [inputQuantity, setInputQuantity] = useState(1);
  const [blurredInputQuantity, setBlurredInputQuantity] = useState(inputQuantity);
  const buttonRef = useRef(null);

  const handleButtonClick = useCallback(() => new Promise((resolve) => {
    conditioner.check().then((fulfilled) => {
      // Resolve early to enable button animation while the request runs
      resolve(fulfilled);

      // Update the product context
      setContextQuantity(parseInt(inputQuantity, 10));
      // Trigger addToCart
      handleAddToCart();
    });
  }), [conditioner, handleAddToCart, inputQuantity, setContextQuantity]);

  const handleOnKeyPress = useCallback((e) => {
    // Simulate button click when enter key was pressed
    if (e.nativeEvent.keyCode === 13) {
      // eslint-disable-next-line extra-rules/no-commented-out-code
      // buttonRef.current.click();
    }
  }, []);

  const handleSanitizeInput = useCallback((value) => {
    const valid = /^\d{0,2}$/i.test(value);

    return valid ? value : inputQuantity;
  }, [inputQuantity]);

  const handleFocusChange = useCallback((focused) => {
    if (!focused) {
      if (!inputQuantity) {
        setInputQuantity(blurredInputQuantity);
      }

      if (inputQuantity) {
        setBlurredInputQuantity(inputQuantity);
      }
    }

    if (focused) {
      setInputQuantity('');
    }
  }, [blurredInputQuantity, inputQuantity]);

  const handleIncreaseButton = useCallback(() => {
    if (inputQuantity <= 99) {
      setInputQuantity(parseInt(inputQuantity) + parseInt(1));
    }
  });

  const handleDecreaseButton = useCallback(() => {
    if (inputQuantity >= 2) {
      setInputQuantity(parseInt(inputQuantity) - parseInt(1));
    }
  });

  return (
    <Section title="product.sections.purchase" className="theme__product__add-to-cart-bar">
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          <button type="button" onClick={handleDecreaseButton} className={styles.cartInputButtonMinus}>
            -
          </button>
          <div className={styles.inputContainer}>
            <Input
              className={styles.input}
              value={inputQuantity.toString()}
              attributes={{
                maxLength: 2,
                size: 2,
                pattern: '[0-9]*',
                type: 'number',
              }}
              validateOnBlur={false}
              onSanitize={handleSanitizeInput}
              onChange={setInputQuantity}
              onFocusChange={handleFocusChange}
              onKeyPress={handleOnKeyPress}
              disabled={disabled}
            />
          </div>
          <button type="button" onClick={handleIncreaseButton} className={styles.cartInputButtonPlus}>
            +
          </button>
          <AddToCartButton
            onClick={handleButtonClick}
            resetClicked={resetClicked}
            isLoading={loading}
            isDisabled={disabled}
            className={styles.button}
            forwardedRef={buttonRef}
          />
        </div>
      </div>
    </Section>
  );
};

AddToCartBar.propTypes = {
  conditioner: PropTypes.shape().isRequired,
  disabled: PropTypes.bool.isRequired,
  handleAddToCart: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  resetClicked: PropTypes.func.isRequired,
};

export default AddToCartBar;
