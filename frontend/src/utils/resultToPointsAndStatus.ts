const resultToPointsAndStatus = (result: any) => {
  let points;
  let
    status = [];

  if (result == null) {
    points = null;
  } else {
    points = result.points;

    if (Array.isArray(result.status)) {
      status = result.status;
    } else {
      status.push(result.status);
    }
  }

  return { points, status };
};

export default resultToPointsAndStatus;
