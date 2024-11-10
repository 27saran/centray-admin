import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";
import Loader from "@/components/Loader";

type DatasProps = {
  datas: { [key: string]: any }[];
};

export const DeviceTable = (props: DatasProps) => {
  const { datas } = props;
  const columns = Object.keys(datas?.[0] || {});

  if (!datas) return <Loader />;

  return (
    <>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns &&
                columns.map((columnName, index) => (
                  <TableCell key={index}>{columnName}</TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {columns && datas.length === 0 ? (
              <TableRow>
                <TableCell
                  component="th"
                  scope="row"
                  colSpan={columns.length}
                >
                  表示するデータが見つかりませんでした
                </TableCell>
              </TableRow>
            ) : (
              datas.map((data: object, index: number) => (
                <TableRow key={index}>
                  {Object.entries(data).map(([key, value]) => (
                    <TableCell key={key} component="th" scope="row" colSpan={1}>
                      {(value != null && value !== 0)  ? String(value) : ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
