import Table from "examples/Tables/Table";
import ArgonBox from "components/ArgonBox";
import { Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { getUsers } from "services/user";
import { Author } from "pages/tables/data/usersTableData";
import ArgonBadge from "components/ArgonBadge";
import ArgonTypography from "components/ArgonTypography";
import { Function } from "pages/tables/data/usersTableData";
import { userImages } from "pages/tables/data/usersTableData";
import EditUserModal from "./Edit"

import dayjs from "dayjs";

const tableData = {
    columns: [
        { name: "author", align: "left" },
        { name: "function", align: "left" },
        { name: "address", align: "left" },
        { name: "status", align: "center" },
        { name: "created_at", align: "center" },
        { name: "action", align: "center" },
    ],
};

const UserTable = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const { columns } = tableData;
    const [accounts, setAccounts] = useState([])

    const [openEdit, setOpenEdit] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null)
    const [modalMode, setModalMode] = useState("VIEW")

    const refresh = async () => {
        const data = await getUsers(currentPage - 1)
        if (!data) return;

        setAccounts(data.content)
        setTotalPages(data.totalPages)
    }

    useEffect(() => {
        (async () => {
            await refresh()
        })()
    }, [currentPage])

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const onViewAccount = (acc) => {
        setModalMode("VIEW")
        setSelectedAccount(acc)
        setOpenEdit(true)
    }

    const onEditAccount = (acc) => {
        setModalMode("EDIT")
        setSelectedAccount(acc)
        setOpenEdit(true)
    }

    const onCloseEdit = () => {
        setOpenEdit(false)
        setSelectedAccount(null)
    }

    return (
        <>
            <ArgonBox
                sx={{
                    "& .MuiTableRow-root:not(:last-child)": {
                        "& td": {
                            borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                                `${borderWidth[1]} solid ${borderColor}`,
                        },
                    },
                }}
            >
                <Table
                    columns={columns}
                    rows={accounts.map((account) => {
                        const user = account.user

                        return ({
                            author: <Author image={userImages[Math.floor((Math.random() * userImages.length))]} name={user.fullName} email={user.email} />,
                            function: <Function job={"User"} org="Gradient" />,
                            address: (
                                <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                                    {user.address}
                                </ArgonTypography>
                            ),
                            status: (
                                <ArgonBadge
                                    variant="gradient"
                                    badgeContent={user.status ? "available" : "unavailable"}
                                    color={user.status ? "success" : "secondary"}
                                    size="xs"
                                    container
                                />
                            ),
                            created_at: (
                                <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                                    {dayjs(user.createdAt).format("DD/MM/YYYY")}
                                </ArgonTypography>
                            ),
                            action: (
                                <ArgonBox sx={{display: 'flex', justifyContent: 'center'}}>
                                    <ArgonTypography
                                        component="a"
                                        href="#"
                                        variant="caption"
                                        color="secondary"
                                        fontWeight="medium"
                                        onClick={() => onViewAccount(account)}
                                    >
                                        View
                                    </ArgonTypography>
                                    <ArgonTypography
                                        component="a"
                                        href="#"
                                        variant="caption"
                                        color="secondary"
                                        fontWeight="medium"
                                        onClick={() => onEditAccount(account)}
                                        sx={{ ml: 1 }}
                                    >
                                        Edit
                                    </ArgonTypography>
                                </ArgonBox>
                            ),
                        })
                    })}
                />
            </ArgonBox>
            <ArgonBox display="flex" justifyContent="center" alignItems="center" p={3}>
                <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} siblingCount={0} boundaryCount={2} />
            </ArgonBox>

            {selectedAccount
                && (
                    <EditUserModal
                        accountId={selectedAccount.accountId}
                        user={selectedAccount.user}
                        open={openEdit}
                        handleClose={onCloseEdit}
                        refresh={refresh}
                        mode={modalMode}
                    />
                )
            }
        </>
    )
}

export default UserTable