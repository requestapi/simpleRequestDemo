interface AWSConfiguration {
  aws: {
    accessKeyId?: string;
    secretAccessKey?: string;
    region: string;
  };
}

interface LoggerConfiguration {
  showDebugLogs?: boolean;
  uploadMaxTimer?: number;
  uploadBatchSize?: number;
}

interface Logger {
  config(configuration: LoggerConfiguration);
  log(level: string, data: any);
}

declare module 'lawgs' {
  function config(settings: AWSConfiguration);
  function getOrCreate(logGroupName: string): Logger;
}
