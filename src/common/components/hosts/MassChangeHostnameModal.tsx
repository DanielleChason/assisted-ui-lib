import * as React from 'react';
import {
  Button,
  ButtonType,
  ButtonVariant,
  Form,
  HelperText,
  HelperTextItem,
  Modal,
  ModalBoxBody,
  ModalBoxFooter,
  Popover,
  Split,
  SplitItem,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { global_palette_blue_300 as blueInfoColor } from '@patternfly/react-tokens/dist/js/global_palette_blue_300';
import { InfoCircleIcon } from '@patternfly/react-icons';

import {
  RichInputField,
  getRichTextValidation,
  richNameValidationSchema,
  hostnameValidationMessages,
  ModalProgress,
} from '../ui';
import { Host } from '../../api';
import { getHostname as getHostnameUtils, getInventory } from './utils';
import { ActionCheck } from './types';
import { getErrorMessage } from '../../utils';
import { useTranslation } from '../../hooks/use-translation-wrapper';

import './MassChangeHostnameModal.css';
import { TFunction } from 'i18next';

const getHostname = (host: Host) => {
  const inventory = getInventory(host);
  return getHostnameUtils(host, inventory) || '';
};

const templateToHostname = (index: number, values: EditHostFormValues) =>
  values.hostname.replace(/{{n+}}/g, `${index + 1}`);

const getNewHostnames = (
  values: EditHostFormValues,
  selectedHosts: Host[],
  canChangeHostname: (host: Host) => ActionCheck,
) => {
  let index = 0;
  return selectedHosts.map((h) => {
    const [changeEnabled, reason] = canChangeHostname(h);
    const hostnameRes = {
      newHostname: changeEnabled ? templateToHostname(index, values) : undefined,
      reason: changeEnabled ? undefined : reason,
    };
    if (changeEnabled) {
      index++;
    }
    return hostnameRes;
  });
};

type EditHostFormValues = {
  hostname: string;
};

const initialValues = {
  hostname: '',
};

const validationSchema = (
  initialValues: EditHostFormValues,
  usedHostnames: string[],
  t: TFunction,
) =>
  Yup.object().shape({
    hostname: richNameValidationSchema(t, usedHostnames, initialValues.hostname).required(),
  });

const withTemplate =
  (
    selectedHosts: Host[],
    hosts: Host[],
    schema: ReturnType<typeof validationSchema>,
    canChangeHostname: (host: Host) => ActionCheck,
    t: TFunction,
  ) =>
  async (values: EditHostFormValues) => {
    const newHostnames = getNewHostnames(values, selectedHosts, canChangeHostname)
      .filter((h) => !h.reason)
      .map(({ newHostname }) => newHostname);

    const usedHostnames = hosts.reduce<string[]>((acc, host) => {
      if (!selectedHosts.find((a) => a.id === host.id)) {
        acc.push(getHostname(host));
      }
      return acc;
    }, []);
    let validationResult = await getRichTextValidation(schema)({
      ...values,
      hostname: newHostnames[0] || '',
    });
    if (
      newHostnames.some((newHostname) => usedHostnames.includes(newHostname || '')) ||
      new Set(newHostnames).size !== newHostnames.length
    ) {
      validationResult = {
        ...(validationResult || {}),
        hostname: (validationResult?.hostname || []).concat(
          hostnameValidationMessages(t).NOT_UNIQUE,
        ),
      };
    }
    return validationResult;
  };

type MassChangeHostnameFormProps = {
  selectedHosts: Host[];
  isOpen: boolean;
  onClose: VoidFunction;
  patchingHost: number;
  canChangeHostname: (host: Host) => ActionCheck;
};

const MassChangeHostnameForm: React.FC<MassChangeHostnameFormProps> = ({
  selectedHosts: initHosts,
  isOpen,
  patchingHost,
  onClose,
  canChangeHostname,
}) => {
  const { values, handleSubmit, isSubmitting, status, isValid } =
    useFormikContext<EditHostFormValues>();

  const hostnameInputRef = React.useRef<HTMLInputElement>();
  const ref = React.useRef<Host[]>(initHosts);

  React.useEffect(() => {
    isOpen && hostnameInputRef.current?.focus();
  }, [isOpen]);

  React.useCallback(() => {
    if (!isSubmitting) {
      ref.current = initHosts;
    }
  }, [initHosts, isSubmitting]);

  const selectedHosts = ref.current;

  const newHostnames = getNewHostnames(values, selectedHosts, canChangeHostname);
  const { t } = useTranslation();
  return (
    <Form onSubmit={handleSubmit}>
      <div>
        <ModalBoxBody>
          <Stack hasGutter>
            <StackItem>
              <div>{t('ai:Rename hostnames using the custom template:')}</div>
              <div>
                <strong>{`{{n}}`}</strong> {t('ai:to add a number.')}
              </div>
            </StackItem>
            <StackItem>
              <RichInputField
                name="hostname"
                ref={hostnameInputRef}
                isRequired
                richValidationMessages={hostnameValidationMessages(t)}
              />
              <HelperText>
                <HelperTextItem variant="indeterminate">
                  {t('ai:For example: host-{{n}}')}
                </HelperTextItem>
              </HelperText>
            </StackItem>
            <StackItem>
              {t('ai:Preview')}
              <Split hasGutter className="hostname-preview">
                <SplitItem className="hostname-column">
                  {selectedHosts.map((h, index) => (
                    <div key={h.id || index} className="hostname-column__text">
                      <strong>{getHostname(h)}</strong>
                    </div>
                  ))}
                </SplitItem>
                <SplitItem>
                  {selectedHosts.map((h, index) => (
                    <div key={h.id || index}>
                      <strong>{'  >  '}</strong>
                    </div>
                  ))}
                </SplitItem>
                <SplitItem isFilled>
                  {selectedHosts.map((h, index) => {
                    const { newHostname, reason } = newHostnames[index];
                    return (
                      <div key={h.id}>
                        {reason ? (
                          <Popover
                            aria-label={t('ai:Cannot change hostname popover')}
                            headerContent={<div>{t('ai:Hostname cannot be changed')}</div>}
                            bodyContent={<div>{reason}</div>}
                          >
                            <Button
                              variant="link"
                              icon={<InfoCircleIcon color={blueInfoColor.value} />}
                              isInline
                            >
                              {t('ai:Not changeable')}
                            </Button>
                          </Popover>
                        ) : (
                          newHostname || t('ai:New hostname will appear here...')
                        )}
                      </div>
                    );
                  })}
                </SplitItem>
              </Split>
            </StackItem>
            <StackItem>
              <ModalProgress
                error={status?.error}
                progress={isSubmitting ? (100 * (patchingHost + 1)) / selectedHosts.length : null}
              />
            </StackItem>
          </Stack>
        </ModalBoxBody>
        <ModalBoxFooter>
          <Button key="submit" type={ButtonType.submit} isDisabled={isSubmitting || !isValid}>
            {t('ai:Change')}
          </Button>
          <Button onClick={onClose} variant={ButtonVariant.secondary} isDisabled={isSubmitting}>
            {t('ai:Cancel')}
          </Button>
        </ModalBoxFooter>
      </div>
    </Form>
  );
};

export type MassChangeHostnameModalProps = {
  hosts: Host[];
  selectedHostIDs: string[];
  isOpen: boolean;
  onClose: VoidFunction;
  // eslint-disable-next-line
  onChangeHostname: (host: Host, hostname: string) => Promise<any>;
  canChangeHostname: (host: Host) => ActionCheck;
};

const MassChangeHostnameModal: React.FC<MassChangeHostnameModalProps> = ({
  isOpen,
  onClose,
  selectedHostIDs,
  hosts,
  onChangeHostname,
  canChangeHostname,
}) => {
  const [patchingHost, setPatchingHost] = React.useState<number>(0);

  const selectedHosts = hosts.filter((h) => selectedHostIDs.includes(h.id));
  const { t } = useTranslation();
  return (
    <Modal
      aria-label={t('ai:Change hostnames dialog')}
      title={t('ai:Change hostnames')}
      isOpen={isOpen}
      onClose={onClose}
      hasNoBodyWrapper
      id="mass-change-hostname-modal"
      variant="small"
    >
      <Formik
        initialValues={initialValues}
        validate={withTemplate(
          selectedHosts,
          hosts,
          validationSchema(initialValues, [], t),
          canChangeHostname,
          t,
        )}
        onSubmit={async (values, formikActions) => {
          let i = 0;
          try {
            for (const agent of selectedHosts) {
              setPatchingHost(i);
              const newHostname = templateToHostname(i, values);
              await onChangeHostname(agent, newHostname);
              i++;
            }
            onClose();
          } catch (e) {
            formikActions.setStatus({
              error: {
                title: t('ai:Failed to update host'),
                message: getErrorMessage(e),
              },
            });
          }
        }}
      >
        <MassChangeHostnameForm
          isOpen={isOpen}
          selectedHosts={selectedHosts}
          patchingHost={patchingHost}
          onClose={onClose}
          canChangeHostname={canChangeHostname}
        />
      </Formik>
    </Modal>
  );
};

export default MassChangeHostnameModal;
