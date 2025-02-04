import { TFunction } from 'i18next';
import * as packageJson from '../../../package.json';
import { ValidationsInfo, HostRole } from '../../common/types/hosts';
import { Cluster, ClusterValidationId, DiskRole, Event, HostValidationId } from '../api';
import { ValidationGroup as ClusterValidationGroup } from '../types/clusters';

export const OPENSHIFT_LIFE_CYCLE_DATES_LINK =
  'https://access.redhat.com/support/policy/updates/openshift#dates';
export const OPENSHIFT_NETWORKING_DOCS_LINK =
  'https://docs.openshift.com/container-platform/4.7/installing/installing_bare_metal/installing-bare-metal.html#installation-network-user-infra_installing-bare-metal';
export const CLUSTER_MANAGER_SITE_LINK = 'https://console.redhat.com/openshift/install/pull-secret';
export const PULL_SECRET_INFO_LINK = CLUSTER_MANAGER_SITE_LINK;
export const ODF_REQUIREMENTS_LINK =
  'https://access.redhat.com/documentation/en-us/red_hat_openshift_data_foundation/4.9/html/planning_your_deployment/infrastructure-requirements_rhodf#resource-requirements_rhodf';
export const VSPHERE_CONFIG_LINK = 'https://access.redhat.com/solutions/6677901';

export const getBugzillaLink = (version = '') =>
  `https://bugzilla.redhat.com/enter_bug.cgi?product=OpenShift%20Container%20Platform&Component=OpenShift%20Container%20Platform&component=assisted-installer&version=${version}`;

export const FEEDBACK_FORM_LINK =
  'https://docs.google.com/forms/d/e/1FAIpQLSfg9M8wRW4m_HkWeAl6KpB5dTcMu8iI3iJ29GlLfZpF2hnjng/viewform';

export const TECH_SUPPORT_LEVEL_LINK = 'https://access.redhat.com/support/offerings/techpreview';

export const ENCRYPTING_DISK_DURING_INSTALLATION =
  'https://docs.openshift.com/container-platform/4.7/installing/install_config/installing-customizing.html#installation-special-config-encrypt-disk_installing-customizing';

export const getOcpConsoleNodesPage = (ocpConsoleUrl: string) =>
  `${ocpConsoleUrl}/k8s/cluster/nodes`;

export const REDHAT_CONSOLE_OPENSHIFT = 'https://console.redhat.com/openshift';

export const SSH_GENERATION_DOC_LINK = 'https://www.redhat.com/sysadmin/configure-ssh-keygen';

// TODO(mlibra): Retrieve branding dynamically, if needed, i.e. via injecting to the "window" object
export const getProductBrandingCode = () => 'redhat';

export const POLLING_INTERVAL = 10 * 1000;
export const EVENTS_POLLING_INTERVAL = 10 * 1000;

export const hostRoles = (t: TFunction): HostRole[] => [
  {
    value: 'auto-assign',
    label: t('ai:Auto-assign'),
    description: t(
      'ai:A role will be chosen automatically based on detected hardware and network latency.',
    ),
  },
  {
    value: 'master',
    label: t('ai:Control plane node'),
    description: t('ai:Runs the control plane components of OpenShift, including the API server.'),
  },
  {
    value: 'worker',
    label: t('ai:Worker'),
    description: t(
      'ai:Runs application workloads. Connect at least 5 hosts to enable dedicated workers.',
    ),
  },
];

export const clusterStatusLabels = (t: TFunction): { [key in Cluster['status']]: string } => ({
  'pending-for-input': t('ai:Draft'),
  insufficient: t('ai:Draft'),
  ready: t('ai:Draft'),
  'preparing-for-installation': t('ai:Preparing for installation'),
  installing: t('ai:Installing'),
  'installing-pending-user-action': t('ai:Installing (pending action)'),
  finalizing: t('ai:Finalizing'),
  cancelled: t('ai:Installation cancelled'),
  error: t('ai:Error'),
  installed: t('ai:Installed'),
  'adding-hosts': t('ai:Adding hosts'),
});

export const clusterFieldLabels = (t: TFunction): { [key in string]: string } => ({
  name: t('ai:Cluster name'),
  baseDnsDomain: t('ai:Base domain'),
  clusterNetworkCidr: t('ai:Cluster network CIDR'),
  clusterNetworkHostPrefix: t('ai:Cluster network host prefix'),
  serviceNetworkCidr: t('ai:Service network CIDR'),
  apiVip: t('ai:API IP'),
  ingressVip: t('ai:Ingress IP'),
  pullSecret: t('ai:Pull secret'),
  sshPublicKey: t('ai:SSH public key'),
  SNODisclaimer: t('ai:Single Node OpenShift disclaimer'),
  diskEncryptionTangServers: t("ai:Tang servers' URLs or thumbprints"),
  selectedHostIds: t('ai:Hosts selection'),
  httpProxy: t('ai:HTTP proxy'),
  httpsProxy: t('ai:HTTPS proxy'),
  noProxy: t('ai:No proxy'),
  machineNetworks: t('ai:Machine networks'),
  clusterNetworks: t('ai:Cluster networks'),
  serviceNetworks: t('ai:Service networks'),
});

export const hostValidationGroupLabels = (
  t: TFunction,
): { [key in keyof ValidationsInfo]: string } => ({
  hardware: t('ai:Hardware'),
  network: t('ai:Network'),
  operators: t('ai:Operators'),
  infrastructure: t('ai:Infrastructure'),
});

export const hostValidationLabels = (t: TFunction): { [key in HostValidationId]: string } => ({
  'odf-requirements-satisfied': t('ai:ODF requirements'),
  'disk-encryption-requirements-satisfied': t('ai:Disk encryption requirements'),
  'compatible-with-cluster-platform': '',
  'has-default-route': t('ai:Default route to host'),
  'sufficient-network-latency-requirement-for-role': t('ai:Network latency'),
  'sufficient-packet-loss-requirement-for-role': t('ai:Packet loss'),
  'has-inventory': t('ai:Hardware information'),
  'has-min-cpu-cores': t('ai:Minimum CPU cores'),
  'has-min-memory': t('ai:Minimum Memory'),
  'has-min-valid-disks': t('ai:Minimum disks of required size'),
  'has-cpu-cores-for-role': t('ai:Minimum CPU cores for selected role'),
  'has-memory-for-role': t('ai:Minimum memory for selected role'),
  'hostname-unique': t('ai:Unique hostname'),
  'hostname-valid': t('ai:Valid hostname'),
  connected: t('ai:Connected'),
  'media-connected': t('ai:Media Connected'),
  'machine-cidr-defined': t('ai:Machine CIDR'),
  'belongs-to-machine-cidr': t('ai:Belongs to machine CIDR'),
  'ignition-downloadable': t('ai:Ignition file downloadable'),
  'belongs-to-majority-group': t('ai:Belongs to majority connected group'),
  'valid-platform-network-settings': t('ai:Platform network settings'),
  'ntp-synced': t('ai:NTP synchronization'),
  'container-images-available': t('ai:Container images availability'),
  'lso-requirements-satisfied': t('ai:LSO requirements'),
  'ocs-requirements-satisfied': t('ai:OCS requirements'),
  'sufficient-installation-disk-speed': t('ai:Installation disk speed'),
  'cnv-requirements-satisfied': t('ai:CNV requirements'),
  'api-domain-name-resolved-correctly': t('ai:API domain name resolution'),
  'api-int-domain-name-resolved-correctly': t('ai:API internal domain name resolution'),
  'apps-domain-name-resolved-correctly': t('ai:Application ingress domain name resolution'),
  'dns-wildcard-not-configured': t('ai:DNS wildcard not configured'),
  'non-overlapping-subnets': t('ai:Non overlapping subnets'),
  'vsphere-disk-uuid-enabled': t('ai:Vsphere disk uuidenabled'),
  'compatible-agent': t('ai:Agent compatibility'),
});

export const hostValidationFailureHints = (
  t: TFunction,
): { [key in HostValidationId]: string } => ({
  'odf-requirements-satisfied': '',
  'disk-encryption-requirements-satisfied': '',
  'compatible-with-cluster-platform': '',
  'has-default-route': '',
  'sufficient-network-latency-requirement-for-role': '',
  'sufficient-packet-loss-requirement-for-role': '',
  'has-inventory': '',
  'has-min-cpu-cores': '',
  'has-min-memory': '',
  'has-min-valid-disks': '',
  'has-cpu-cores-for-role': '',
  'has-memory-for-role': '',
  'hostname-unique': '',
  'hostname-valid': '',
  connected: '',
  'media-connected': '',
  'machine-cidr-defined': '',
  'belongs-to-machine-cidr': '',
  'ignition-downloadable': '',
  'belongs-to-majority-group': '',
  'valid-platform-network-settings': '',
  'ntp-synced': t(
    "ai:Please manually fix host's NTP configuration or provide additional NTP sources.",
  ),
  'container-images-available': '',
  'lso-requirements-satisfied': '',
  'ocs-requirements-satisfied': '',
  'sufficient-installation-disk-speed': '',
  'cnv-requirements-satisfied': '',
  'api-domain-name-resolved-correctly': '',
  'api-int-domain-name-resolved-correctly': '',
  'apps-domain-name-resolved-correctly': '',
  'dns-wildcard-not-configured': '',
  'non-overlapping-subnets': '',
  'vsphere-disk-uuid-enabled': '',
  'compatible-agent': '',
});

export const clusterValidationLabels = (
  t: TFunction,
): { [key in ClusterValidationId]: string } => ({
  'odf-requirements-satisfied': t('ai:ODF requirements'),
  'network-type-valid': t('ai:Valid network type'),
  'machine-cidr-defined': t('ai:Machine CIDR'),
  'cluster-cidr-defined': t('ai:Cluster CIDR'),
  'service-cidr-defined': t('ai:Service CIDR'),
  'no-cidrs-overlapping': t('ai:No overlapping CIDR'),
  'networks-same-address-families': t('ai:Networks same address families'),
  'network-prefix-valid': t('ai:Valid network prefix'),
  'machine-cidr-equals-to-calculated-cidr': t('ai:Machine CIDR conforms expected'),
  'api-vip-defined': t('ai:API IP'),
  'api-vip-valid': t('ai:API IP validity'),
  'ingress-vip-defined': t('ai:Ingress IP'),
  'ingress-vip-valid': t('ai:Ingress IP validity'),
  'all-hosts-are-ready-to-install': t('ai:All hosts are ready to install'),
  'sufficient-masters-count': t('ai:Control plane nodes count'),
  'dns-domain-defined': t('ai:DNS domain'),
  'pull-secret-set': t('ai:Pull secret'),
  'ntp-server-configured': t('ai:NTP server'),
  'lso-requirements-satisfied': t('ai:LSO requirements'),
  'ocs-requirements-satisfied': t('ai:OCS requirements'),
  'cnv-requirements-satisfied': t('ai:CNV requirements'),
});

export const clusterValidationGroupLabels = (
  t: TFunction,
): { [key in ClusterValidationGroup]: string } => ({
  configuration: t('ai:General configuration'),
  hostsData: t('ai:Hosts'),
  'hosts-data': t('ai:Hosts'),
  network: t('ai:Networking'),
  operators: t('ai:Operators'),
});

export const CLUSTER_DEFAULT_NETWORK_SETTINGS_IPV4 = {
  clusterNetworkCidr: '10.128.0.0/14',
  clusterNetworkHostPrefix: 23,
  serviceNetworkCidr: '172.30.0.0/16',
};

export const CLUSTER_DEFAULT_NETWORK_SETTINGS_IPV6 = {
  clusterNetworkCidr: '2002:db8::/53',
  clusterNetworkHostPrefix: 64,
  serviceNetworkCidr: '2003:db8::/112',
};

export const getAssistedUiLibVersion = () => packageJson.version;

export const EVENT_SEVERITIES: Event['severity'][] = ['info', 'warning', 'error', 'critical'];

export const TIME_ZERO = '0001-01-01T00:00:00.000Z';

export const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const NO_SUBNET_SET = 'NO_SUBNET_SET';

export const NETWORK_TYPE_OVN = 'OVNKubernetes';
export const NETWORK_TYPE_SDN = 'OpenShiftSDN';

export const IPV4_STACK = 'singleStack';
export const DUAL_STACK = 'dualStack';

export const PREFIX_MAX_RESTRICTION = {
  IPv6: 128,
  IPv4: 25,
};

export const diskRoleLabels = (t: TFunction): { [key in DiskRole]: string } => ({
  none: t('ai:None'),
  install: t('ai:Installation disk'),
});

export const SNO_SUPPORT_MIN_VERSION = 4.8;

// The API uses free-form string for operator names, so let's gueard at least using constants
export const OPERATOR_NAME_CNV = 'cnv';
export const OPERATOR_NAME_LSO = 'lso';
export const OPERATOR_NAME_OCS = 'ocs'; // TODO(jkilzi): Remove once OCS is replaced by ODF
export const OPERATOR_NAME_ODF = 'odf';
export const OPERATOR_NAME_CVO = 'cvo';
export const OPERATOR_NAME_CONSOLE = 'console';

export const operatorLabels = (t: TFunction) => ({
  [OPERATOR_NAME_CONSOLE]: t('ai:OpenShift Console'),
  [OPERATOR_NAME_CVO]: t('ai:OpenShift Cluster Version Operator'),
  [OPERATOR_NAME_LSO]: t('ai:OpenShift Local Storage'),
  [OPERATOR_NAME_OCS]: t('ai:OpenShift Container Storage'), // TODO(jkilzi): Remove once OCS is replaced by ODF
  [OPERATOR_NAME_ODF]: t('ai:OpenShift Data Foundation'),
  [OPERATOR_NAME_CNV]: t('ai:OpenShift Virtualization'),
});

export const OCP_STATIC_IP_DOC =
  'https://docs.openshift.com/container-platform/latest/scalability_and_performance/ztp-deploying-disconnected.html#ztp-configuring-a-static-ip_ztp-deploying-disconnected';
