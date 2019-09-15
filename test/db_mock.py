from app.file import File


def reset_db(db):
    db.session.query(File).delete()
    db.session.commit()


def mock_db_calls(db, count):
    reset_db(db)
    for status in ["Completed", "In Progress"]:
        for i in range(int(count / 2)):
            create_new_file(db, name="Downloads {}".format(i), status=status)


def create_new_file(
    db,
    name="Filename",
    directory="/downloads",
    url="http://url.com",
    status="In Progress",
    log="",
    percent=50.0,
):
    file = File(
        name=name, directory=directory, url=url, status=status, log=log, percent=percent
    )
    db.session.add(file)
    return file
