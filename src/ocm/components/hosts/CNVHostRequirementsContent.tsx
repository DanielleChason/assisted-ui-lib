import { useClusterPreflightRequirements } from '../../hooks';
import { ErrorState, LoadingState, OPERATOR_NAME_CNV, RenderIf } from '../../../common';
import { List, ListItem } from '@patternfly/react-core';
import React from 'react';
import { PreflightRequirementsContentProps } from './HostRequirementsContent';

export const CNVHostRequirementsContent = ({
  clusterId,
  isSingleNode = false,
}: PreflightRequirementsContentProps) => {
  const { preflightRequirements, error, isLoading } = useClusterPreflightRequirements(clusterId);

  if (isLoading) {
    return <LoadingState content="Loading hardware requirements ..." />;
  }
  if (error) {
    return <ErrorState />;
  }

  const cnvRequirements = preflightRequirements?.operators?.find(
    (operatorRequirements) => operatorRequirements.operatorName === OPERATOR_NAME_CNV,
  );

  const workerRequirements = cnvRequirements?.requirements?.worker?.quantitative;
  const masterRequirements = cnvRequirements?.requirements?.master?.quantitative;

  return (
    <>
      <List>
        <ListItem>
          Enabled CPU virtualization support in BIOS (Intel-VT / AMD-V) on all nodes
        </ListItem>
        <RenderIf condition={!isSingleNode}>
          <ListItem>
            Each worker node requires an additional {workerRequirements?.ramMib || 360} MiB of
            memory {workerRequirements?.diskSizeGb ? ',' : ' and'}{' '}
            {workerRequirements?.cpuCores || 2} CPUs
            {workerRequirements?.diskSizeGb
              ? ` and ${workerRequirements?.diskSizeGb} storage space`
              : ''}
          </ListItem>
        </RenderIf>
        <ListItem>
          Each control plane node requires an additional {masterRequirements?.ramMib || 150} MiB of
          memory {masterRequirements?.diskSizeGb ? ',' : ' and'} {masterRequirements?.cpuCores || 4}{' '}
          CPUs
          {masterRequirements?.diskSizeGb
            ? ` and ${masterRequirements?.diskSizeGb} storage space`
            : ''}
        </ListItem>
        <RenderIf condition={!isSingleNode}>
          <ListItem>
            OpenShift Data Foundation (recommended for full functionality) or another persistent
            storage service
          </ListItem>
        </RenderIf>
      </List>
    </>
  );
};

export default CNVHostRequirementsContent;
