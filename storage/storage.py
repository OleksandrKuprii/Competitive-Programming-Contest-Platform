def get_correct_results(test_ids_iterable):
    def get_correct_result(_id):
        path = f'../storage/test/{_id}/output.txt'

        with open(path, 'r') as f:
            return f.read()

    output_data = []

    for test_id in test_ids_iterable:
        output_data.append(get_correct_result(test_id))

    return output_data
