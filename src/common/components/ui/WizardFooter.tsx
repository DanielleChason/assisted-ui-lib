import * as React from 'react';
import {
  ActionList,
  ActionListItem,
  Button,
  ButtonVariant,
  Spinner,
  Stack,
  StackItem,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { useTranslation } from '../../hooks/use-translation-wrapper';

export type WizardFooterGenericProps = {
  onNext?: () => void;
  onBack?: () => void;
  onCancel?: () => void;
  isNextDisabled?: boolean;
  isBackDisabled?: boolean;
  isSubmitting?: boolean;
  submittingText?: string;
  nextButtonText?: string;
};

type WizardFooterProps = WizardFooterGenericProps & {
  alerts?: React.ReactNode;
  errors?: React.ReactNode;
  leftExtraActions?: React.ReactNode;
};

export const WizardFooter: React.FC<WizardFooterProps> = ({
  alerts,
  errors,
  onNext,
  onBack,
  onCancel,
  isNextDisabled,
  isBackDisabled,
  leftExtraActions,
  isSubmitting,
  submittingText,
  nextButtonText,
}) => {
  const { t } = useTranslation();
  submittingText = submittingText || t('ai:Saving changes...');
  return (
    <Stack hasGutter>
      {alerts && <StackItem>{alerts}</StackItem>}
      {errors && <StackItem>{errors}</StackItem>}
      <StackItem>
        <ActionList data-testid="wizard-step-actions">
          {leftExtraActions}
          {onNext && (
            <ActionListItem>
              <Button
                variant={ButtonVariant.primary}
                name="next"
                onClick={onNext}
                isDisabled={isNextDisabled}
              >
                {nextButtonText || t('ai:Next')}
              </Button>
            </ActionListItem>
          )}
          {onBack && (
            <ActionListItem>
              <Button
                variant={ButtonVariant.secondary}
                name="back"
                onClick={onBack}
                isDisabled={isBackDisabled}
              >
                {t('ai:Back')}
              </Button>
            </ActionListItem>
          )}
          <ActionListItem>
            <Button
              variant={ButtonVariant.link}
              name="cancel"
              onClick={onCancel}
              isDisabled={false}
            >
              {t('ai:Cancel')}
            </Button>
          </ActionListItem>
          {isSubmitting && (
            <ActionListItem>
              <Text component={TextVariants.small}>
                <Spinner size="sm" /> {submittingText}
              </Text>
            </ActionListItem>
          )}
        </ActionList>
      </StackItem>
    </Stack>
  );
};
