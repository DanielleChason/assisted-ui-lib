import React from 'react';
import {
  Alert,
  AlertVariant,
  FormGroup,
  StackItem,
  TextInputTypes,
  Grid,
} from '@patternfly/react-core';
import { FieldArray, useFormikContext } from 'formik';
import { NetworkConfigurationValues } from '../../../../common/types';
import { useFeature } from '../../../../common/features';
import { InputField } from '../../../../common/components/ui';
import { DUAL_STACK, PREFIX_MAX_RESTRICTION } from '../../../../common/config/constants';
import { NetworkTypeControlGroup } from '../../../../common/components/clusterWizard/networkingSteps/NetworkTypeControlGroup';

type AdvancedNetworkFieldsProps = {
  isSDNSelectable: boolean;
};

const getNextworkLabelSuffix = (index: number, isDualStack: boolean) => {
  return isDualStack ? ` (${index === 0 ? 'IPv4' : 'IPv6'})` : '';
};

const IPv4PrefixHelperText =
  'The subnet prefix length to assign to each individual node. For example, if Cluster Network Host Prefix is set to 23, then each node is assigned a /23 subnet out of the given cidr (clusterNetworkCIDR), which allows for 510 (2^(32 - 23) - 2) pod IPs addresses. If you are required to provide access to nodes from an external network, configure load balancers and routers to manage the traffic.';

const IPv6PrefixHelperText =
  'The subnet prefix length to assign to each individual node. For example, if Cluster Network Host Prefix is set to 116, then each node is assigned a /116 subnet out of the given cidr (clusterNetworkCIDR), which allows for 4,094 (2^(128 - 116) - 2) pod IPs addresses. If you are required to provide access to nodes from an external network, configure load balancers and routers to manage the traffic.';

const clusterCidrHelperText =
  'IP address block from which Pod IPs are allocated. This block must not overlap with existing physical networks. These IP addresses are used for the Pod network, and if you need to access the Pods from an external network, configure load balancers and routers to manage the traffic.';

const serviceCidrHelperText =
  'The IP address pool to use for service IP addresses. You can enter only one IP address pool. If you need to access the services from an external network, configure load balancers and routers to manage the traffic.';

const AdvancedNetworkFields: React.FC<AdvancedNetworkFieldsProps> = ({ isSDNSelectable }) => {
  const { setFieldValue, values, errors } = useFormikContext<NetworkConfigurationValues>();

  const isNetworkTypeSelectionEnabled = useFeature(
    'ASSISTED_INSTALLER_NETWORK_TYPE_SELECTION_FEATURE',
  );

  const isDualStack = values.stackType === DUAL_STACK;

  const clusterNetworkCidrPrefix = (index: number) =>
    parseInt(
      ((values.clusterNetworks && values.clusterNetworks[index].cidr) || '').split('/')[1],
    ) || 1;

  const formatClusterNetworkHostPrefix = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (isNaN(parseInt(e.target.value))) {
      setFieldValue(`clusterNetworks.${index}.hostPrefix`, clusterNetworkCidrPrefix(index));
    }
  };

  const isSubnetIPv6 = (index: number) => (isDualStack ? !!index : false);

  const clusterNetworkHostPrefixHelperText = (index: number) =>
    isSubnetIPv6(index) ? IPv6PrefixHelperText : IPv4PrefixHelperText;

  return (
    <Grid hasGutter>
      <FieldArray name="clusterNetworks">
        {() => (
          <FormGroup fieldId="clusterNetworks" labelInfo={isDualStack && 'Primary'}>
            {values.clusterNetworks?.map((_, index) => {
              const networkSuffix = getNextworkLabelSuffix(index, isDualStack);
              return (
                <StackItem key={index} className={'network-field-group'}>
                  <InputField
                    name={`clusterNetworks.${index}.cidr`}
                    label={`Cluster network CIDR${networkSuffix}`}
                    helperText={clusterCidrHelperText}
                    isRequired
                    labelInfo={index === 0 && isDualStack ? 'Primary' : ''}
                  />
                  <InputField
                    name={`clusterNetworks.${index}.hostPrefix`}
                    label={`Cluster network host prefix${networkSuffix}`}
                    type={TextInputTypes.number}
                    min={clusterNetworkCidrPrefix(index)}
                    max={
                      isSubnetIPv6(index)
                        ? PREFIX_MAX_RESTRICTION.IPv6
                        : PREFIX_MAX_RESTRICTION.IPv4
                    }
                    onBlur={(e) =>
                      formatClusterNetworkHostPrefix(
                        e as React.ChangeEvent<HTMLInputElement>,
                        index,
                      )
                    }
                    helperText={clusterNetworkHostPrefixHelperText(index)}
                    isRequired
                  />
                </StackItem>
              );
            })}
          </FormGroup>
        )}
      </FieldArray>

      {typeof errors.clusterNetworks === 'string' && (
        <Alert variant={AlertVariant.warning} title={errors.clusterNetworks} isInline />
      )}

      <FieldArray name="serviceNetworks">
        {() => (
          <FormGroup fieldId="serviceNetworks" labelInfo={isDualStack && 'Primary'}>
            {values.serviceNetworks?.map((_, index) => (
              <StackItem key={index} className={'network-field-group'}>
                <InputField
                  name={`serviceNetworks.${index}.cidr`}
                  label={`Service network CIDR${getNextworkLabelSuffix(index, isDualStack)}`}
                  helperText={serviceCidrHelperText}
                  isRequired
                  labelInfo={index === 0 && isDualStack ? 'Primary' : ''}
                />
              </StackItem>
            ))}
          </FormGroup>
        )}
      </FieldArray>

      {typeof errors.serviceNetworks === 'string' && (
        <Alert variant={AlertVariant.warning} title={errors.serviceNetworks} isInline />
      )}

      {isNetworkTypeSelectionEnabled && (
        <NetworkTypeControlGroup isSDNSelectable={isSDNSelectable} />
      )}
    </Grid>
  );
};

export default AdvancedNetworkFields;
