const mapTestsFromApi = (tests: any) => tests.map((test: any) => ({
  status: test.status,
  points: test.points,
  cpuTime: test.cpu_time,
  realtime: test.wall_time,
}));

export default mapTestsFromApi;
