import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import {
  Button,
  ButtonVariant,
  PageSectionVariants,
  TextContent,
  Text,
  PageSection,
} from '@patternfly/react-core';
import { AddCircleOIcon } from '@patternfly/react-icons';

import { selectClusterTableRows, selectClustersUIState } from '../../selectors/clusters';
import {
  ResourceUIState,
  Alerts,
  LoadingState,
  ErrorState,
  EmptyState,
  useAlerts,
  AlertsContextProvider,
} from '../../../common';
import ClustersTable from './ClustersTable';
import { fetchClustersAsync, deleteCluster } from '../../reducers/clusters/clustersSlice';
import { handleApiError, getApiErrorMessage } from '../../api/utils';
import ClusterBreadcrumbs from './ClusterBreadcrumbs';
import { routeBasePath } from '../../config';
import { ClustersService } from '../../services';
import { useTranslation } from '../../../common/hooks/use-translation-wrapper';

type ClustersProps = RouteComponentProps;

const Clusters: React.FC<ClustersProps> = ({ history }) => {
  const { LOADING, EMPTY, ERROR, RELOADING } = ResourceUIState;
  const { addAlert } = useAlerts();
  const { t } = useTranslation();
  const clusterRows = useSelector(selectClusterTableRows(t));
  const clustersUIState = useSelector(selectClustersUIState);
  const uiState = React.useRef(clustersUIState);
  if (clustersUIState !== RELOADING) {
    uiState.current = clustersUIState;
  }
  const dispatch = useDispatch();
  const deleteClusterAsync = React.useCallback(
    async (clusterId) => {
      try {
        await ClustersService.delete(clusterId);
        dispatch(deleteCluster(clusterId));
      } catch (e) {
        handleApiError(e, () =>
          addAlert({
            title: 'Cluster could not be deleted',
            message: getApiErrorMessage(e),
          }),
        );
      }
    },
    [dispatch, addAlert],
  );

  const fetchClusters = React.useCallback(() => dispatch(fetchClustersAsync()), [dispatch]);
  React.useEffect(() => {
    fetchClusters();
  }, [fetchClusters]);

  switch (uiState.current) {
    case LOADING:
      return (
        <PageSection variant={PageSectionVariants.light} isFilled>
          <LoadingState />
        </PageSection>
      );
    case ERROR:
      return (
        <PageSection variant={PageSectionVariants.light} isFilled>
          <ErrorState title="Failed to fetch clusters." fetchData={fetchClusters} />
        </PageSection>
      );
    case EMPTY:
      return (
        <PageSection variant={PageSectionVariants.light} isFilled>
          <EmptyState
            icon={AddCircleOIcon}
            title="Create new assisted cluster"
            content="There are no clusters yet. This wizard is going to guide you through the OpenShift cluster deployment."
            primaryAction={
              <Button
                variant={ButtonVariant.primary}
                onClick={() => history.push(`${routeBasePath}/clusters/~new`)}
                id="empty-state-new-cluster-button"
                data-ouia-id="button-create-new-cluster"
              >
                Create New Cluster
              </Button>
            }
          />
        </PageSection>
      );
    default:
      return (
        <>
          <ClusterBreadcrumbs />
          <PageSection variant={PageSectionVariants.light}>
            <TextContent>
              <Text component="h1">Assisted Clusters</Text>
            </TextContent>
          </PageSection>
          <PageSection variant={PageSectionVariants.light} isFilled>
            <Alerts />
            <ClustersTable rows={clusterRows} deleteCluster={deleteClusterAsync} />
          </PageSection>
        </>
      );
  }
};

const ClustersPage: React.FC<RouteComponentProps> = (props) => (
  <AlertsContextProvider>
    <Clusters {...props} />
  </AlertsContextProvider>
);

export default ClustersPage;
