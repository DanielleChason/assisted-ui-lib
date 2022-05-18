import React from 'react';
import {
  ChangeHostnameAction,
  HostsNotShowingLinkProps,
  getSchedulableMasters,
  Cluster,
  Host,
  useAlerts,
  HostsTableActions,
  stringToJSON,
  isSNO,
  DeleteHostAction,
  TableToolbar,
} from "../../../common";
import { HostsTableModals, useHostsTable } from './use-hosts-table';
import {
  countColumn,
  cpuCoresColumn,
  discoveredAtColumn,
  disksColumn,
  hostnameColumn,
  memoryColumn,
  roleColumn,
} from '../../../common/components/hosts/tableUtils';
import HostsTable, { HostsTableEmptyState } from '../../../common/components/hosts/HostsTable';
import { HostDetail } from '../../../common/components/hosts/HostRowDetail';
import { ExpandComponentProps, TableRow } from '../../../common/components/hosts/AITable';
import { AdditionalNTPSourcesDialogToggle } from './AdditionaNTPSourceDialogToggle';
import { onDiskRoleType } from '../../../common/components/hosts/DiskRole';
import { useDispatch } from 'react-redux';
import { sortable } from '@patternfly/react-table';
import { ValidationsInfo } from '../../../common/types/hosts';
import HardwareStatus from './HardwareStatus';
import { Stack, StackItem } from '@patternfly/react-core';
import { usePagination } from '../../../common/components/hosts/usePagination';

export const hardwareStatusColumn = (
  onEditHostname?: HostsTableActions['onEditHost'],
): TableRow<Host> => {
  return {
    header: {
      title: 'Status',
      props: {
        id: 'col-header-hwstatus',
      },
      transforms: [sortable],
    },
    cell: (host) => {
      const validationsInfo = stringToJSON<ValidationsInfo>(host.validationsInfo) || {};
      const editHostname = onEditHostname ? () => onEditHostname(host) : undefined;
      return {
        title: (
          <HardwareStatus
            host={host}
            onEditHostname={editHostname}
            validationsInfo={validationsInfo}
          />
        ),
        props: { 'data-testid': 'host-hw-status' },
        sortableValue: status,
      };
    },
  };
};

const getExpandComponent =
  (onDiskRole: onDiskRoleType, canEditDisks: (host: Host) => boolean) =>
  // eslint-disable-next-line react/display-name
  ({ obj: host }: ExpandComponentProps<Host>) =>
    (
      <HostDetail
        key={host.id}
        host={host}
        onDiskRole={onDiskRole}
        canEditDisks={canEditDisks}
        AdditionalNTPSourcesDialogToggleComponent={AdditionalNTPSourcesDialogToggle}
      />
    );

type HostsDiscoveryTableProps = {
  cluster: Cluster;
  skipDisabled?: boolean;
  setDiscoveryHintModalOpen?: HostsNotShowingLinkProps['setDiscoveryHintModalOpen'];
};

const HostsDiscoveryTable: React.FC<HostsDiscoveryTableProps> = ({
  cluster,
  setDiscoveryHintModalOpen,
}) => {
  const {
    onEditHost,
    actionChecks,
    onEditRole,
    onDiskRole,
    actionResolver,
    onSelect,
    selectedHostIDs,
    setSelectedHostIDs,
    onMassChangeHostname,
    onMassDeleteHost,
    ...modalProps
  } = useHostsTable(cluster);

  const dispatch = useDispatch();
  const { alerts, addAlert, removeAlert } = useAlerts();

  const content = React.useMemo(
    () => [
      hostnameColumn(onEditHost, undefined, actionChecks.canEditHostname),
      roleColumn(
        actionChecks.canEditRole,
        onEditRole,
        getSchedulableMasters(cluster),
        !isSNO(cluster),
      ),
      hardwareStatusColumn(onEditHost),
      discoveredAtColumn,
      cpuCoresColumn,
      memoryColumn,
      disksColumn,
      countColumn(cluster),
    ],
    [onEditHost, actionChecks.canEditHostname, actionChecks.canEditRole, onEditRole, cluster],
  );

  const hosts = cluster.hosts || [];
  const paginationProps = usePagination(hosts.length);
  const itemIDs = hosts.map((h) => h.id);

  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <TableToolbar
            selectedIDs={selectedHostIDs || []}
            itemIDs={itemIDs}
            setSelectedIDs={setSelectedHostIDs}
            actions={[
              <ChangeHostnameAction key="hostname" onChangeHostname={onMassChangeHostname} />,
              <DeleteHostAction key="delete" onDeleteHost={onMassDeleteHost} />,
            ]}
            {...paginationProps}
          />
        </StackItem>
        <StackItem>
          <HostsTable
            testId="hosts-discovery-table"
            hosts={cluster.hosts || []}
            content={content}
            actionResolver={actionResolver}
            ExpandComponent={getExpandComponent(onDiskRole, actionChecks.canEditDisks)}
            onSelect={onSelect}
            selectedIDs={selectedHostIDs}
            setSelectedHostIDs={setSelectedHostIDs}
            {...paginationProps}
          >
            <HostsTableEmptyState
              isSNO={isSNO(cluster)}
              setDiscoveryHintModalOpen={setDiscoveryHintModalOpen}
            />
          </HostsTable>
        </StackItem>
      </Stack>
      <HostsTableModals cluster={cluster} {...modalProps} />
    </>
  );
};

export default HostsDiscoveryTable;
