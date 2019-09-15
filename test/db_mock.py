from app.file import File


def reset_db(db):
    db.session.query(File).delete()
    db.session.commit()


def mock_db_calls(db, count):
    reset_db(db)
    for status in ["Completed", "In Progress"]:
        for i in range(int(count / 2)):
            file = File(
                name="Download {}".format(i),
                directory="/downloads",
                url="url",
                status=status,
                log="",
                percent=0.0,
            )
            db.session.add(file)
            db.session.commit()
